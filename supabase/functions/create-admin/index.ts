
import { serve } from "https://deno.land/std@0.168.0/http/server.ts"
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    // Create Supabase client with service role
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false
        }
      }
    )

    // Get the authorization header
    const authHeader = req.headers.get('authorization')
    if (!authHeader) {
      throw new Error('No authorization header')
    }

    // Create regular Supabase client to verify the requesting user
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    )

    // Get user from the auth header
    const { data: { user }, error: userError } = await supabase.auth.getUser(
      authHeader.replace('Bearer ', '')
    )

    if (userError || !user) {
      throw new Error('Invalid user token')
    }

    // Check if the requesting user is an admin
    const { data: isAdmin } = await supabase.rpc('is_admin', { user_uuid: user.id })
    if (!isAdmin) {
      throw new Error('User is not authorized to create admins')
    }

    // Parse request body
    const { firstName, middleName, lastName, email, password } = await req.json()

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      throw new Error('Missing required fields')
    }

    console.log('Creating auth user for admin:', email)

    // Try to create the authentication user first with metadata
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true, // Auto-confirm email for admin users
      user_metadata: {
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        full_name: `${firstName} ${middleName ? middleName + ' ' : ''}${lastName}`.trim()
      }
    })

    // If user already exists, we'll get a specific error
    if (authError) {
      if (authError.message.includes('already registered') || authError.message.includes('User already registered')) {
        // User exists, let's try to get their user ID from our customers table
        const { data: existingCustomer } = await supabaseAdmin
          .from('customers')
          .select('user_id')
          .eq('email', email)
          .single()

        if (existingCustomer?.user_id) {
          // Check if this user is already an admin
          const { data: existingAdmin } = await supabaseAdmin
            .from('admins')
            .select('id')
            .eq('user_id', existingCustomer.user_id)
            .eq('is_active', true)
            .single()

          if (existingAdmin) {
            throw new Error('This user is already an admin')
          }

          // Create admin record for existing user
          const { data: adminData, error: adminError } = await supabaseAdmin
            .from('admins')
            .insert({
              user_id: existingCustomer.user_id,
              first_name: firstName,
              middle_name: middleName || null,
              last_name: lastName,
              email: email,
              created_by: user.id,
              is_active: true
            })
            .select()

          if (adminError) {
            console.error('Admin creation error:', adminError)
            throw new Error(`Failed to create admin record: ${adminError.message}`)
          }

          return new Response(
            JSON.stringify({ 
              success: true, 
              admin: adminData[0],
              message: 'Admin privileges granted to existing user'
            }),
            { 
              headers: { ...corsHeaders, 'Content-Type': 'application/json' },
              status: 200 
            }
          )
        } else {
          throw new Error('User with this email exists but is not in our system')
        }
      } else {
        console.error('Auth user creation error:', authError)
        throw new Error(`Failed to create auth user: ${authError.message}`)
      }
    }

    if (!authData.user) {
      throw new Error('No user data returned from auth creation')
    }

    console.log('Auth user created successfully:', authData.user.id)

    // Check if admin record already exists (shouldn't happen for new users, but just in case)
    const { data: existingAdmin } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('user_id', authData.user.id)
      .eq('is_active', true)
      .single()

    if (existingAdmin) {
      throw new Error('This user is already an admin')
    }

    // Create the admin record
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admins')
      .insert({
        user_id: authData.user.id,
        first_name: firstName,
        middle_name: middleName || null,
        last_name: lastName,
        email: email,
        created_by: user.id,
        is_active: true
      })
      .select()

    if (adminError) {
      console.error('Admin creation error:', adminError)
      throw new Error(`Failed to create admin record: ${adminError.message}`)
    }

    console.log('Admin created successfully:', adminData)

    return new Response(
      JSON.stringify({ 
        success: true, 
        admin: adminData[0],
        message: 'Admin user created successfully with authentication access'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200 
      }
    )

  } catch (error) {
    console.error('Error in create-admin function:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: error.message 
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400 
      }
    )
  }
})

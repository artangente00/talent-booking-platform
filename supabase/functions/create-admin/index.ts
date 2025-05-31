
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

    // Check if user already exists first
    const { data: existingUser, error: checkError } = await supabaseAdmin.auth.admin.getUserByEmail(email)
    
    let authUserId = null
    
    if (existingUser?.user) {
      // User already exists, use existing user ID
      authUserId = existingUser.user.id
      console.log('Using existing auth user:', authUserId)
    } else {
      // Create new authentication user using service role
      const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true // Auto-confirm email for admin users
      })

      if (authError) {
        console.error('Auth user creation error:', authError)
        throw new Error(`Failed to create auth user: ${authError.message}`)
      }

      if (!authData.user) {
        throw new Error('No user data returned from auth creation')
      }

      authUserId = authData.user.id
      console.log('Auth user created successfully:', authUserId)
    }

    // Check if admin record already exists
    const { data: existingAdmin, error: adminCheckError } = await supabaseAdmin
      .from('admins')
      .select('id')
      .eq('user_id', authUserId)
      .eq('is_active', true)
      .single()

    if (existingAdmin) {
      throw new Error('This user is already an admin')
    }

    if (adminCheckError && adminCheckError.code !== 'PGRST116') {
      console.error('Admin check error:', adminCheckError)
      throw new Error(`Failed to check existing admin: ${adminCheckError.message}`)
    }

    // Create the admin record
    const { data: adminData, error: adminError } = await supabaseAdmin
      .from('admins')
      .insert({
        user_id: authUserId,
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
        message: authUserId === existingUser?.user?.id 
          ? 'Admin privileges granted to existing user' 
          : 'Admin user created successfully with authentication access'
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

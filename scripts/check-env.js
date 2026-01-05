#!/usr/bin/env node

/**
 * Skripta za provjeru environment varijabli
 * Pokrenite: node scripts/check-env.js
 */

import { readFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
const rootDir = join(__dirname, '..')

console.log('🔍 Provjera environment varijabli...\n')

// Provjeri da li postoji .env fajl
let envExists = false
try {
  const envPath = join(rootDir, '.env')
  readFileSync(envPath, 'utf-8')
  envExists = true
  console.log('✅ .env fajl postoji\n')
} catch (error) {
  console.log('❌ .env fajl NE POSTOJI!\n')
  console.log('📝 Kreirajte .env fajl:')
  console.log('   1. Kopirajte .env.example u .env')
  console.log('   2. Popunite vrijednosti iz Supabase Dashboard\n')
  process.exit(1)
}

// Učitaj .env fajl
const envPath = join(rootDir, '.env')
const envContent = readFileSync(envPath, 'utf-8')

// Provjeri ključne varijable
const requiredVars = {
  'PUBLIC_SUPABASE_URL': 'Supabase Project URL',
  'PUBLIC_SUPABASE_ANON_KEY': 'Supabase Anon Key',
  'SUPABASE_SERVICE_ROLE_KEY': 'Supabase Service Role Key',
  'ADMIN_PASSWORD': 'Admin Password',
}

let allOk = true

console.log('Provjera varijabli:\n')

for (const [varName, description] of Object.entries(requiredVars)) {
  const regex = new RegExp(`^${varName}=(.+)$`, 'm')
  const match = envContent.match(regex)
  
  if (match && match[1] && match[1].trim() !== '' && !match[1].includes('xxxxx')) {
    const value = match[1].trim()
    // Provjeri format za Supabase URL
    if (varName === 'PUBLIC_SUPABASE_URL') {
      if (value.startsWith('https://') && value.includes('.supabase.co')) {
        console.log(`✅ ${varName}: ${value.substring(0, 30)}...`)
      } else {
        console.log(`❌ ${varName}: Neispravan format! Mora biti https://xxx.supabase.co`)
        allOk = false
      }
    } else {
      console.log(`✅ ${varName}: Postavljeno`)
    }
  } else {
    console.log(`❌ ${varName}: NEDOSTAJE ili nije ispravno postavljeno`)
    console.log(`   ${description}`)
    allOk = false
  }
}

console.log('\n')

if (allOk) {
  console.log('✅ Sve environment varijable su ispravno postavljene!')
  console.log('\n💡 Ako i dalje imate probleme:')
  console.log('   1. Provjerite da li je Supabase projekt aktivan')
  console.log('   2. Restartajte development server (npm run dev)')
  console.log('   3. Provjerite SUPABASE_TROUBLESHOOTING.md za više pomoći')
} else {
  console.log('❌ Neke varijable nedostaju ili nisu ispravno postavljene!')
  console.log('\n📚 Upute:')
  console.log('   1. Otvorite Supabase Dashboard: https://supabase.com/dashboard')
  console.log('   2. Project Settings → API tab')
  console.log('   3. Kopirajte URL i ključeve u .env fajl')
  console.log('   4. Provjerite SUPABASE_TROUBLESHOOTING.md za detaljne upute')
  process.exit(1)
}


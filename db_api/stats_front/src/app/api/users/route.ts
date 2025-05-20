import { NextResponse } from 'next/server';
import { Pool } from 'pg';
import { saltAndHashPassword } from '@/app/utils/snhpass';
import { auth } from '@/../auth';

const pool = new Pool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE_NAME,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

// GET all users 
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const client = await pool.connect();
    const result = await client.query('SELECT id, name, email, role FROM users ORDER BY id ASC');
    client.release();
    return NextResponse.json(result.rows);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

// POST a new user 
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const client = await pool.connect();
  
  try {
    // Begin transaction with SERIALIZABLE isolation level (highest isolation)
    await client.query('BEGIN TRANSACTION ISOLATION LEVEL SERIALIZABLE');
    
    const { name, email, password, role } = await req.json();

    if (!name || !email || !password || !role) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Check if email already exists
    const checkResult = await client.query(
      'SELECT 1 FROM users WHERE email = $1 FOR UPDATE',
      [email]
    );
    
    if (checkResult.rows.length > 0) {
      await client.query('ROLLBACK');
      client.release();
      return NextResponse.json({ message: 'User with this email already exists' }, { status: 409 });
    }

    const hashedPassword = await saltAndHashPassword(password);

    // Insert new user
    const result = await client.query(
      'INSERT INTO users (name, email, password, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role',
      [name, email, hashedPassword, role]
    );

    // Commit the transaction if everything succeeded
    await client.query('COMMIT');
    client.release();

    return NextResponse.json(result.rows[0], { status: 201 });
  } catch (error) {
    // Rollback in case of any error
    await client.query('ROLLBACK').catch(rollbackError => {
      console.error('Error rolling back transaction:', rollbackError);
    });
    client.release();
    
    console.error('Error creating user:', error);
    return NextResponse.json({ message: 'Error creating user' }, { status: 500 });
  }
}
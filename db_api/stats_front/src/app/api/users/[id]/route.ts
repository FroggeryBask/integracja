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

// Helper function to get params
async function getParams(params: { id: string }) {
  return params;
}

// PUT (Update) a user
export async function PUT(req: Request, { params }: { params: { id: string } }) {
  const { id } = await getParams(params);
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    const { name, email, password, role } = await req.json();

    if (!name || !email || !role) {
      return NextResponse.json({ message: 'Missing required fields (name, email, role)' }, { status: 400 });
    }

    await client.query('BEGIN');

    const emailCheck = await client.query(
      'SELECT id FROM users WHERE email = $1 AND id != $2',
      [email, userId]
    );
    
    if (emailCheck.rowCount > 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: 'Another user with this email already exists' }, { status: 409 });
    }

    let result;
    if (password) {
      const hashedPassword = await saltAndHashPassword(password);
      result = await client.query(
        'UPDATE users SET name = $1, email = $2, password = $3, role = $4 WHERE id = $5 RETURNING id, name, email, role',
        [name, email, hashedPassword, role, userId]
      );
    } else {
      result = await client.query(
        'UPDATE users SET name = $1, email = $2, role = $3 WHERE id = $4 RETURNING id, name, email, role',
        [name, email, role, userId]
      );
    }

    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json(result.rows[0]);
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error updating user:', error);
    return NextResponse.json({ message: 'Error updating user' }, { status: 500 });
  } finally {
    client.release();
  }
}

// DELETE a user
export async function DELETE(req: Request, { params }: { params: { id: string } }) {

  const { id } = await getParams(params);
  const session = await auth();
  
  if (!session?.user || session.user.role !== 'admin') {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const userId = parseInt(id, 10);
  if (isNaN(userId)) {
    return NextResponse.json({ message: 'Invalid user ID' }, { status: 400 });
  }

  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    const userCheck = await client.query('SELECT id FROM users WHERE id = $1', [userId]);
    if (userCheck.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    const result = await client.query('DELETE FROM users WHERE id = $1 RETURNING id', [userId]);
    
    if (result.rowCount === 0) {
      await client.query('ROLLBACK');
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
    }

    await client.query('COMMIT');
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 });
  } catch (error) {
    await client.query('ROLLBACK');
    console.error('Error deleting user:', error);
    return NextResponse.json({ message: 'Error deleting user' }, { status: 500 });
  } finally {
    client.release();
  }
}
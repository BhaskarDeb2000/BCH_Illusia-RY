-- Create items table
CREATE TABLE IF NOT EXISTS items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name JSONB NOT NULL,
    description JSONB NOT NULL,
    category TEXT NOT NULL,
    tags TEXT[] NOT NULL DEFAULT '{}',
    quantity INTEGER NOT NULL DEFAULT 0,
    image_url TEXT,
    storage_details JSONB,
    location TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    item_id UUID NOT NULL REFERENCES items(id) ON DELETE CASCADE,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    start_date TIMESTAMP WITH TIME ZONE NOT NULL,
    end_date TIMESTAMP WITH TIME ZONE NOT NULL,
    status TEXT NOT NULL CHECK (status IN ('pending', 'approved', 'rejected', 'cancelled', 'completed')),
    special_requests TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create booking_locks table
CREATE TABLE IF NOT EXISTS booking_locks (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    key TEXT NOT NULL UNIQUE,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create email_queue table
CREATE TABLE IF NOT EXISTS email_queue (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    to_email TEXT NOT NULL,
    subject TEXT NOT NULL,
    html TEXT NOT NULL,
    retry_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_retry_at TIMESTAMP WITH TIME ZONE,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'sent', 'failed'))
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_items_category ON items(category);
CREATE INDEX IF NOT EXISTS idx_items_tags ON items USING GIN(tags);
CREATE INDEX IF NOT EXISTS idx_bookings_item_id ON bookings(item_id);
CREATE INDEX IF NOT EXISTS idx_bookings_user_id ON bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_bookings_dates ON bookings(start_date, end_date);
CREATE INDEX IF NOT EXISTS idx_bookings_status ON bookings(status);
CREATE INDEX IF NOT EXISTS idx_booking_locks_expires ON booking_locks(expires_at);
CREATE INDEX IF NOT EXISTS idx_email_queue_status ON email_queue(status);

-- Add RLS policies
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;
ALTER TABLE booking_locks ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_queue ENABLE ROW LEVEL SECURITY;

-- Items policies
CREATE POLICY "Anyone can view items"
    ON items FOR SELECT
    USING (true);

CREATE POLICY "Only admins can modify items"
    ON items FOR ALL
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin.com'));

-- Bookings policies
CREATE POLICY "Users can view their own bookings"
    ON bookings FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own bookings"
    ON bookings FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all bookings"
    ON bookings FOR SELECT
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin.com'));

CREATE POLICY "Admins can update all bookings"
    ON bookings FOR UPDATE
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin.com'));

-- Booking locks policies
CREATE POLICY "Anyone can create booking locks"
    ON booking_locks FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Anyone can delete booking locks"
    ON booking_locks FOR DELETE
    USING (true);

-- Email queue policies
CREATE POLICY "Only admins can view email queue"
    ON email_queue FOR SELECT
    USING (auth.uid() IN (SELECT id FROM auth.users WHERE email LIKE '%@admin.com'));

CREATE POLICY "System can insert into email queue"
    ON email_queue FOR INSERT
    WITH CHECK (true);

CREATE POLICY "System can update email queue"
    ON email_queue FOR UPDATE
    USING (true); 
-- Initial Schema for Sales Intelligence SaaS

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    name VARCHAR(255),
    google_id VARCHAR(255),
    avatar_url TEXT,
    email_verified BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE plans (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price_inr INTEGER NOT NULL,
    billing_cycle VARCHAR(50) NOT NULL,
    token_limit INTEGER NOT NULL,
    report_limit INTEGER NOT NULL,
    features JSONB DEFAULT '{}',
    is_active BOOLEAN DEFAULT true
);

CREATE TABLE subscriptions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    plan_id VARCHAR(50) REFERENCES plans(id),
    status VARCHAR(50) DEFAULT 'active',
    razorpay_subscription_id VARCHAR(255),
    starts_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP WITH TIME ZONE,
    tokens_used INTEGER DEFAULT 0,
    tokens_limit INTEGER NOT NULL,
    reports_generated INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE token_usage (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    subscription_id UUID REFERENCES subscriptions(id) ON DELETE SET NULL,
    tokens_consumed INTEGER NOT NULL,
    action VARCHAR(255) NOT NULL,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE reports (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    product VARCHAR(255) NOT NULL,
    industry VARCHAR(255) NOT NULL,
    report_data JSONB NOT NULL,
    tokens_used INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE training_data (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID REFERENCES users(id) ON DELETE CASCADE,
    source_type VARCHAR(50) NOT NULL,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    processed BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Seed Plans
INSERT INTO plans (id, name, price_inr, billing_cycle, token_limit, report_limit, features) VALUES
('free', 'Always Free', 0, 'monthly', 10000, 3, '{"pdf_export": false, "training_uploads": 0, "share_reports": false}'),
('trial', 'Free Trial 1 Month', 0, 'monthly', 100000, 50, '{"pdf_export": true, "training_uploads": 3, "share_reports": true}'),
('monthly', 'Monthly ₹999', 999, 'monthly', 500000, -1, '{"pdf_export": true, "training_uploads": -1, "share_reports": true}'),
('lifetime', 'One-Time ₹9999', 9999, 'lifetime', 500000, -1, '{"pdf_export": true, "training_uploads": -1, "share_reports": true}')
ON CONFLICT (id) DO NOTHING;

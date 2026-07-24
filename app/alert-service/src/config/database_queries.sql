CREATE TABLE alert_rules (

    id UUID PRIMARY KEY,

    organization_id VARCHAR(100) NOT NULL,

    account_id VARCHAR(100) NOT NULL,

    region VARCHAR(50) NOT NULL,

    service VARCHAR(50) NOT NULL,

    resource_type VARCHAR(50) NOT NULL,

    resource_id VARCHAR(200) NOT NULL,

    metric VARCHAR(100) NOT NULL,

    operator VARCHAR(5) NOT NULL,

    threshold DOUBLE PRECISION NOT NULL,

    enabled BOOLEAN NOT NULL DEFAULT TRUE,

    created_at TIMESTAMP NOT NULL DEFAULT NOW()

);


CREATE TABLE alerts (

    id UUID PRIMARY KEY,

    rule_id UUID NOT NULL,

    organization_id VARCHAR(100) NOT NULL,

    account_id VARCHAR(100) NOT NULL,

    region VARCHAR(50) NOT NULL,

    service VARCHAR(50) NOT NULL,

    resource_type VARCHAR(50) NOT NULL,

    resource_id VARCHAR(200) NOT NULL,

    resource_name VARCHAR(200) NOT NULL,

    metric VARCHAR(100) NOT NULL,

    operator VARCHAR(5) NOT NULL,

    current_value DOUBLE PRECISION NOT NULL,

    threshold DOUBLE PRECISION NOT NULL,

    state VARCHAR(20) NOT NULL,

    created_at TIMESTAMP NOT NULL,

    resolved_at TIMESTAMP NULL,

    CONSTRAINT fk_alert_rule
        FOREIGN KEY (rule_id)
        REFERENCES alert_rules(id)

);

CREATE INDEX idx_alert_rules_resource
ON alert_rules (
    service,
    resource_type,
    resource_id
);

CREATE INDEX idx_alerts_state
ON alerts (
    state
);

CREATE INDEX idx_alerts_rule
ON alerts (
    rule_id
);

CREATE INDEX idx_alerts_resource
ON alerts (
    resource_id
);

CREATE INDEX idx_alerts_active
ON alerts (
    rule_id,
    resource_id,
    state
);
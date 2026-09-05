# Signed webhook gateway

See webhook.py for required environment and commands. Configure the GitHub webhook URL to this gateway, not directly to n8n. Set its secret to WEBHOOK_SECRET. Only ALLOWED_REPOS are accepted. In n8n create Header Auth credential: name `X-Academy-Gateway`, value N8N_GATEWAY_TOKEN. Keep n8n webhook endpoints on loopback/private network. Configure N8N_ISSUE_URL/N8N_PR_URL/N8N_PUSH_URL.

The inbox survives restarts. Run --drain periodically to retry; inspect dead_letter rows after five failures. Delivery is at least once: retain source delivery ID as idempotency key in the business destination. Test invalid signature, forbidden repository, duplicate and restart with fictional events. This gateway never logs credentials.

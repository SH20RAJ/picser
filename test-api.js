#!/usr/bin/env node

/**
 * Simple test script for Picser API endpoints
 * Usage: node test-api.js
 */

const API_BASE = 'http://localhost:3000';

const colors = {
    green: '\x1b[32m',
    red: '\x1b[31m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    reset: '\x1b[0m'
};

const log = {
    success: (msg) => console.log(`${colors.green}✓ ${msg}${colors.reset}`),
    error: (msg) => console.log(`${colors.red}✗ ${msg}${colors.reset}`),
    info: (msg) => console.log(`${colors.blue}ℹ ${msg}${colors.reset}`),
    warning: (msg) => console.log(`${colors.yellow}⚠ ${msg}${colors.reset}`)
};

async function testEndpoint(name, endpoint, options = {}) {
    try {
        log.info(`Testing ${name}...`);
        const response = await fetch(`${API_BASE}${endpoint}`, options);
        const data = await response.json();

        if (response.ok) {
            log.success(`${name} - Status: ${response.status}`);
            if (data.message) log.info(`Message: ${data.message}`);
            return { success: true, data };
        } else {
            log.error(`${name} - Status: ${response.status}`);
            log.error(`Error: ${data.error || 'Unknown error'}`);
            return { success: false, data };
        }
    } catch (error) {
        log.error(`${name} - Network error: ${error.message}`);
        return { success: false, error: error.message };
    }
}

async function runTests() {
    console.log(`${colors.blue}🧪 Testing Picser API Endpoints${colors.reset}\n`);

    // Test GET endpoints
    await testEndpoint('Upload API Info', '/api/upload', { method: 'GET' });
    await testEndpoint('Public Upload API Info', '/api/public-upload', { method: 'GET' });
    await testEndpoint('Test Config API Info', '/api/test-config', { method: 'GET' });

    console.log('\n' + '='.repeat(50) + '\n');

    // Test configuration endpoint with dummy data
    log.info('Testing configuration validation with dummy data...');
    await testEndpoint('Test Config (Invalid)', '/api/test-config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            github_token: 'invalid_token',
            github_owner: 'nonexistent',
            github_repo: 'nonexistent'
        })
    });

    console.log('\n' + '='.repeat(50) + '\n');

    log.warning('To test with real GitHub credentials:');
    log.info('1. Set up your .env.local file with valid GitHub credentials');
    log.info('2. Replace the test data in this script with your actual values');
    log.info('3. Run the script again');

    console.log(`\n${colors.blue}📚 API Documentation: ${API_BASE}/api-docs${colors.reset}`);
}

// Run the tests
runTests().catch(console.error);

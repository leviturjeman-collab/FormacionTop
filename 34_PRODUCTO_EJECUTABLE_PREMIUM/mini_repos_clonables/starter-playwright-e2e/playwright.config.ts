import {defineConfig} from '@playwright/test';
export default defineConfig({testDir:'./tests',use:{baseURL:'http://127.0.0.1:4178'},webServer:{command:'node test-server.mjs',url:'http://127.0.0.1:4178',reuseExistingServer:false},workers:1});

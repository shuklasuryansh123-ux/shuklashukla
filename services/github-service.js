// GitHub Integration Service for Auto-Deployment
class GitHubService {
    constructor() {
        this.baseURL = 'https://api.github.com';
        this.token = process.env.GITHUB_TOKEN;
        this.repo = process.env.GITHUB_REPO || 'your-username/shukla-law-firm';
        this.branch = process.env.GITHUB_BRANCH || 'main';
    }

    // Initialize GitHub service
    async init() {
        if (!this.token) {
            throw new Error('GitHub token not configured. Please set GITHUB_TOKEN environment variable.');
        }
        
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.repo}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });
            
            if (!response.ok) {
                throw new Error(`GitHub repository not accessible: ${response.statusText}`);
            }
            
            console.log('GitHub service initialized successfully');
            return true;
        } catch (error) {
            console.error('GitHub service initialization failed:', error);
            throw error;
        }
    }

    // Get current file content from GitHub
    async getFileContent(path) {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.repo}/contents/${path}?ref=${this.branch}`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (response.status === 404) {
                return null; // File doesn't exist
            }

            if (!response.ok) {
                throw new Error(`Failed to get file content: ${response.statusText}`);
            }

            const data = await response.json();
            return {
                content: Buffer.from(data.content, 'base64').toString('utf-8'),
                sha: data.sha
            };
        } catch (error) {
            console.error(`Error getting file content for ${path}:`, error);
            throw error;
        }
    }

    // Update file content on GitHub
    async updateFile(path, content, message = 'Update content via admin panel') {
        try {
            // Get current file to get SHA
            const currentFile = await this.getFileContent(path);
            const sha = currentFile ? currentFile.sha : null;

            const body = {
                message: message,
                content: Buffer.from(content).toString('base64'),
                branch: this.branch
            };

            if (sha) {
                body.sha = sha;
            }

            const response = await fetch(`${this.baseURL}/repos/${this.repo}/contents/${path}`, {
                method: 'PUT',
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json',
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(body)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(`Failed to update file: ${error.message}`);
            }

            const result = await response.json();
            console.log(`File ${path} updated successfully`);
            return result;
        } catch (error) {
            console.error(`Error updating file ${path}:`, error);
            throw error;
        }
    }

    // Create or update multiple files
    async updateMultipleFiles(files, commitMessage = 'Update multiple files via admin panel') {
        try {
            const tree = [];
            const baseTree = await this.getBaseTree();

            for (const file of files) {
                const content = typeof file.content === 'string' ? file.content : JSON.stringify(file.content, null, 2);
                const blob = await this.createBlob(content);
                
                tree.push({
                    path: file.path,
                    mode: '100644',
                    type: 'blob',
                    sha: blob.sha
                });
            }

            const newTree = await this.createTree(tree, baseTree);
            const commit = await this.createCommit(commitMessage, newTree.sha, baseTree);
            await this.updateRef(commit.sha);

            console.log('Multiple files updated successfully');
            return commit;
        } catch (error) {
            console.error('Error updating multiple files:', error);
            throw error;
        }
    }

    // Get base tree SHA
    async getBaseTree() {
        const response = await fetch(`${this.baseURL}/repos/${this.repo}/git/refs/heads/${this.branch}`, {
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        });

        if (!response.ok) {
            throw new Error('Failed to get base tree');
        }

        const data = await response.json();
        return data.object.sha;
    }

    // Create blob
    async createBlob(content) {
        const response = await fetch(`${this.baseURL}/repos/${this.repo}/git/blobs`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                content: content,
                encoding: 'utf-8'
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create blob');
        }

        return await response.json();
    }

    // Create tree
    async createTree(tree, baseTree) {
        const response = await fetch(`${this.baseURL}/repos/${this.repo}/git/trees`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                tree: tree,
                base_tree: baseTree
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create tree');
        }

        return await response.json();
    }

    // Create commit
    async createCommit(message, treeSha, parentSha) {
        const response = await fetch(`${this.baseURL}/repos/${this.repo}/git/commits`, {
            method: 'POST',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                message: message,
                tree: treeSha,
                parents: [parentSha]
            })
        });

        if (!response.ok) {
            throw new Error('Failed to create commit');
        }

        return await response.json();
    }

    // Update reference
    async updateRef(commitSha) {
        const response = await fetch(`${this.baseURL}/repos/${this.repo}/git/refs/heads/${this.branch}`, {
            method: 'PATCH',
            headers: {
                'Authorization': `token ${this.token}`,
                'Accept': 'application/vnd.github.v3+json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                sha: commitSha
            })
        });

        if (!response.ok) {
            throw new Error('Failed to update reference');
        }

        return await response.json();
    }

    // Trigger deployment (for Render/Railway)
    async triggerDeployment() {
        try {
            // For Render, you can trigger a webhook
            const renderWebhookUrl = process.env.RENDER_WEBHOOK_URL;
            if (renderWebhookUrl) {
                const response = await fetch(renderWebhookUrl, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        event: 'deployment',
                        timestamp: new Date().toISOString(),
                        service: 'shukla-law-firm'
                    })
                });

                if (response.ok) {
                    console.log('Render deployment triggered successfully');
                    return true;
                }
            }

            // For Railway, you can use their API
            const railwayToken = process.env.RAILWAY_TOKEN;
            const railwayServiceId = process.env.RAILWAY_SERVICE_ID;
            
            if (railwayToken && railwayServiceId) {
                const response = await fetch(`https://backboard.railway.app/graphql/v2`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${railwayToken}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        query: `
                            mutation {
                                serviceDeploy(serviceId: "${railwayServiceId}") {
                                    id
                                    status
                                }
                            }
                        `
                    })
                });

                if (response.ok) {
                    console.log('Railway deployment triggered successfully');
                    return true;
                }
            }

            // For Vercel deployment
            const vercelToken = process.env.VERCEL_TOKEN;
            const vercelProjectId = process.env.VERCEL_PROJECT_ID;
            
            if (vercelToken && vercelProjectId) {
                const response = await fetch(`https://api.vercel.com/v1/integrations/deploy/${vercelProjectId}`, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${vercelToken}`,
                        'Content-Type': 'application/json'
                    }
                });

                if (response.ok) {
                    console.log('Vercel deployment triggered successfully');
                    return true;
                }
            }

            console.log('No deployment webhook configured');
            return false;
        } catch (error) {
            console.error('Error triggering deployment:', error);
            return false;
        }
    }

    // Get deployment status
    async getDeploymentStatus() {
        try {
            const response = await fetch(`${this.baseURL}/repos/${this.repo}/deployments`, {
                headers: {
                    'Authorization': `token ${this.token}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            });

            if (!response.ok) {
                throw new Error('Failed to get deployment status');
            }

            const deployments = await response.json();
            return deployments.length > 0 ? deployments[0] : null;
        } catch (error) {
            console.error('Error getting deployment status:', error);
            return null;
        }
    }
}

module.exports = GitHubService;

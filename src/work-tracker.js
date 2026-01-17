const fs = require('fs');
const { execSync } = require('child_process');
const path = require('path');

class WorkTracker {
    constructor() {
        this.logFile = path.join(__dirname, 'work-log.txt');
        this.readmePath = path.join(__dirname, 'README.md');
        this.lastSnapshot = null;
    }

    getCurrentTimestamp() {
        return new Date().toLocaleString('en-US', {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    }

    getGitStatus() {
        try {
            const status = execSync('git status --short', { encoding: 'utf-8' });
            return status.trim();
        } catch (error) {
            return 'No git repository detected';
        }
    }

    getModifiedFiles() {
        try {
            const modified = execSync('git diff --name-only', { encoding: 'utf-8' });
            const untracked = execSync('git ls-files --others --exclude-standard', { encoding: 'utf-8' });
            const staged = execSync('git diff --staged --name-only', { encoding: 'utf-8' });
            
            const allFiles = new Set([
                ...modified.split('\n').filter(f => f),
                ...untracked.split('\n').filter(f => f),
                ...staged.split('\n').filter(f => f)
            ]);
            
            return Array.from(allFiles);
        } catch (error) {
            return [];
        }
    }

    detectActivity() {
        const files = this.getModifiedFiles();
        const gitStatus = this.getGitStatus();
        
        const activities = [];
        
        if (files.length === 0 && !gitStatus) {
            activities.push('No changes detected');
        } else {
            if (files.some(f => f.endsWith('.js'))) activities.push('Working on JavaScript files');
            if (files.some(f => f.endsWith('.proto'))) activities.push('Modifying Protocol Buffer definitions');
            if (files.some(f => f.endsWith('.json'))) activities.push('Updating configuration files');
            if (files.some(f => f.includes('README'))) activities.push('Updating documentation');
            if (files.length > 0 && activities.length === 0) activities.push(`Modified ${files.length} file(s)`);
        }
        
        return {
            activities,
            files: files.slice(0, 10), // Limit to 10 files
            fileCount: files.length
        };
    }

    logToFile(entry) {
        const logEntry = `${entry}\n${'─'.repeat(80)}\n`;
        fs.appendFileSync(this.logFile, logEntry);
    }

    updateReadme(entry) {
        try {
            let readme = fs.readFileSync(this.readmePath, 'utf-8');
            
            // Find the Work Log section and add entry after the date
            const dateHeader = '### January 16, 2026';
            
            if (readme.includes(dateHeader)) {
                // Add entry after the date header
                const lines = readme.split('\n');
                const dateIndex = lines.findIndex(line => line.includes(dateHeader));
                
                if (dateIndex !== -1) {
                    // Find where to insert (after the date, before task lists start)
                    let insertIndex = dateIndex + 1;
                    
                    // Skip existing time entries to add at the top
                    while (insertIndex < lines.length && lines[insertIndex].trim().startsWith('-')) {
                        if (lines[insertIndex].includes('**') && lines[insertIndex].includes(':**')) {
                            break;
                        }
                        insertIndex++;
                    }
                    
                    lines.splice(insertIndex, 0, entry);
                    readme = lines.join('\n');
                    fs.writeFileSync(this.readmePath, readme);
                }
            }
        } catch (error) {
            console.error('Could not update README:', error.message);
        }
    }

    trackProgress() {
        const timestamp = this.getCurrentTimestamp();
        const { activities, files, fileCount } = this.detectActivity();
        
        // Create log entry
        let entry = `[${timestamp}]\n`;
        entry += `Activities: ${activities.join(', ')}\n`;
        
        if (files.length > 0) {
            entry += `Files: ${files.join(', ')}`;
            if (fileCount > 10) {
                entry += ` (and ${fileCount - 10} more)`;
            }
            entry += '\n';
        }
        
        // Log to file
        this.logToFile(entry);
        
        // Create README entry
        const readmeEntry = `- **${timestamp}:** ${activities.join(', ')}`;
        this.updateReadme(readmeEntry);
        
        console.log(`✓ Progress logged at ${timestamp}`);
        console.log(`  ${activities.join(', ')}`);
    }

    startTracking(intervalMinutes = 20) {
        console.log(`🚀 Work tracker started - logging every ${intervalMinutes} minutes`);
        console.log(`📝 Logs saved to: work-log.txt`);
        console.log(`📄 README updated automatically\n`);
        
        // Initial log
        this.trackProgress();
        
        // Set interval for periodic tracking
        const intervalMs = intervalMinutes * 60 * 1000;
        setInterval(() => {
            this.trackProgress();
        }, intervalMs);
        
        // Keep the process running
        console.log('Press Ctrl+C to stop tracking\n');
    }
}

// Run the tracker
if (require.main === module) {
    const tracker = new WorkTracker();
    const intervalMinutes = process.argv[2] || 20;
    tracker.startTracking(parseInt(intervalMinutes));
}

module.exports = WorkTracker;

$files = git status -s | ForEach-Object { $_.Substring(3).Trim() }

foreach ($file in $files) {
    if (-not $file) { continue }
    
    if ($file -match "package.json") { $msg = "updated the packages to add some cool new libraries" }
    elseif ($file -match "package-lock.json") { $msg = "locked the new dependencies" }
    elseif ($file -match "globals.css") { $msg = "added a custom scrollbar and selection colors to make it look premium" }
    elseif ($file -match "VerificationEmail") { $msg = "completely redesigned the verification email to look super professional" }
    elseif ($file -match "next.config.ts") { $msg = "ignored annoying build errors so we can actually deploy this thing" }
    elseif ($file -match "dashboard/page.tsx") { $msg = "made the dashboard much prettier and added empty states" }
    elseif ($file -match "analytics") { $msg = "built a really cool chart to track messages and views" }
    elseif ($file -match "MessageCard") { $msg = "fixed the tiny font sizes on the message card tooltips" }
    elseif ($file -match "Navbar") { $msg = "made the logo click take you straight to the dashboard" }
    elseif ($file -match "sendVerificationEmail") { $msg = "switched to nodemailer to send emails for free using gmail" }
    elseif ($file -match "verify") { $msg = "made the otp input look like a real code field with big spacing" }
    elseif ($file -match "layout.tsx") { $msg = "tweaked the main layout structure for better routing" }
    elseif ($file -match "not-found.tsx") { $msg = "designed a beautiful 404 page that lets people claim usernames" }
    elseif ($file -match "ThemeToggle") { $msg = "polished up the dark mode switch button" }
    elseif ($file -match "welcome") { $msg = "built a nice welcome screen telling users how to share their link" }
    elseif ($file -match "profile/page.tsx") { $msg = "built the settings page to let people change themes or delete accounts" }
    elseif ($file -match "User.ts") { $msg = "updated the database schema for the user profiles" }
    elseif ($file -match "route.ts") { $msg = "updated the backend api logic to be more secure and handle errors better" }
    elseif ($file -match "ui/") { $msg = "brought in some new shadcn ui components to make things look sleek" }
    elseif ($file -match "public/") { $msg = "added some image assets for the background" }
    elseif ($file -match "src/app/u/") { $msg = "made the public profile page look stunning with dynamic counters" }
    elseif ($file -match "favicon.ico") { $msg = "removed the old default nextjs favicon" }
    elseif ($file -match "resend.ts") { $msg = "deleted the old resend logic since we use nodemailer now" }
    elseif ($file -match "schema") { $msg = "tweaked the validation schemas for better error catching" }
    elseif ($file -match "dbConnect") { $msg = "improved the database connection stability" }
    elseif ($file -match "rateLimit") { $msg = "added rate limiting to stop people from spamming our app" }
    elseif ($file -match "utils.ts") { $msg = "added some handy utility functions" }
    elseif ($file -match "page..tsx") { $msg = "cleaned up an accidental typo file" }
    else { 
        # Extract filename from path to make the message sound natural
        $filename = Split-Path $file -Leaf
        $msg = "cleaned up the code and made some minor adjustments to $filename" 
    }
    
    # If the file was deleted, we use `git rm`, otherwise `git add`
    if ((git status -s -- $file) -match "^ D ") {
        git rm $file
    } else {
        git add $file
    }
    
    git commit -m $msg
}

git push origin main

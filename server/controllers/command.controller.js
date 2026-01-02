import { Command } from "../models/command.model.js";
import { User } from "../models/user.model.js";


export const getCliCommandGuest = async (req, res) => {
    const { appName, os = 'linux' } = req.body; // Default to Linux if not provided

    if (!appName) {
        return res.status(400).json({ error: "Application name is required" });
    }

    // New smart prompt without strict OS validation
    const prompt = `
You are a terminal assistant.

The user is asking for the correct CLI command for: "${appName}"

Their system is described as: "${os}"

Your job:
- First, understand what the user is trying to install or do based on "${appName}"
- Then, detect which OS or distribution they are using based on "${os}" (e.g., Arch, Ubuntu, macOS, Windows, Fedora, Kali, etc.)
- Based on that, return the exact CLI command using the appropriate package manager or native system command:
  - apt for Ubuntu/Debian/Kali
  - pacman for Arch/Manjaro
  - dnf for Fedora/RHEL/CentOS
  - brew for macOS
  - winget or choco for Windows
  - npm or pip if it's a Node.js or Python package
  - or a native shell command for basic tasks (e.g., "list directories", "check IP")

❗ Very Important:
- Output ONLY the final terminal command — no explanations, no descriptions
- Do NOT include multiple command options
- Do NOT include markdown or code block formatting
- Just one clean one-liner CLI command

Examples:
"git" + "arch" → sudo pacman -S git  
"curl" + "ubuntu" → sudo apt install -y curl  
"requests" + "macOS" → pip install requests  
"how to check IP" + "windows" → ipconfig  
`;

    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemma-3n-e4b-it:free",
                messages: [
                    {
                        role: "user",
                        content: prompt
                    }
                ],
                max_tokens: 100
            })
        });

        const data = await response.json();
        console.log(data);

        if (data.error) {
            console.error("OpenRouter API Error:", data.error);
            return res.status(500).json({ error: data.error.message || "OpenRouter API call failed" });
        }

        let command = data.choices?.[0]?.message?.content || "No response content found";

        // Clean response: remove any markdown or formatting
        command = command.trim().replace(/^```(bash|shell|powershell)?|```$/g, '').trim();

        console.log("Final command:", command);

        return res.json({
            command,
            appName,
            os
        });

    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};



export const getCliCommandForAuthenticatedUser = async (req, res) => {
    const { appName, os = 'linux' } = req.body;

    if (!appName) {
        return res.status(400).json({ error: "Application name is required" });
    }

    const validOS = ['linux', 'windows', 'mac', 'macos'];
    if (!validOS.includes(os.toLowerCase())) {
        return res.status(400).json({ error: "Invalid OS specified. Use 'linux', 'windows', or 'mac'." });
    }

    const targetOS = os.toLowerCase();

    const prompt = `
You are a terminal assistant.

The user is asking for the correct CLI command for: "${appName}"

Their system is described as: "${os}"

Your job:
- First, understand what the user is trying to install or do based on "${appName}"
- Then, detect which OS or distribution they are using based on "${os}" (e.g., Arch, Ubuntu, macOS, Windows, Fedora, Kali, etc.)
- Based on that, return the exact CLI command using the appropriate package manager or native system command:
  - apt for Ubuntu/Debian/Kali
  - pacman for Arch/Manjaro
  - dnf for Fedora/RHEL/CentOS
  - brew for macOS
  - winget or choco for Windows
  - npm or pip if it's a Node.js or Python package
  - or a native shell command for basic tasks (e.g., "list directories", "check IP")

❗ Very Important:
- Output ONLY the final terminal command — no explanations, no descriptions
- Do NOT include multiple command optionsclear
- Do NOT include markdown or code block formatting
- Just one clean one-liner CLI command

Examples:
"git" + "arch" → sudo pacman -S git  
"curl" + "ubuntu" → sudo apt install -y curl  
"requests" + "macOS" → pip install requests  
"how to check IP" + "windows" → ipconfig  
`;


    try {
        const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
            method: "POST",
            headers: {
                "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                model: "google/gemma-3n-e4b-it:free",
                messages: [{ role: "user", content: prompt }],
                max_tokens: 100
            })
        });

        const data = await response.json();

        if (data.error) {
            console.error("OpenRouter API Error:", data.error);
            return res.status(500).json({ error: data.error.message || "OpenRouter API call failed" });
        }

        let command = data.choices?.[0]?.message?.content || "No response content found";
        command = command.trim().replace(/^```(bash|shell|powershell)?|```$/g, '').trim();

        // Save to DB only if user is authenticated
        if (req.user && req.user._id) {
            await Command.create({
                command,
                os: targetOS,
                appName: appName,
                user: req.user._id,
                timestamp: new Date()
            });
            console.log("Command saved to DB for user:", req.user._id);
        } else {
            console.log("Unauthenticated user – not saving to DB");
        }

        return res.json({
            command,
            appName,
            os: targetOS,
            saved: !!req.user // true if user is logged in, false otherwise
        });
    } catch (error) {
        console.error("Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};

export const deleteCommand = async (req, res) => {
    const { id } = req.params;
    const command = await Command.findById(id);

    if (!command) {
        return res.status(404).json({ message: "Command not found" });
    }

    await command.deleteOne();
    res.status(200).json({ message: "Command deleted successfully" });


}
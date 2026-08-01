const config = {
    // Bot Information
    name: "SARU Bot",
    description: "",
    bot_token: process.env["Discord_Token"],
    clientID: process.env["Client_ID"],

    // Permissions Information 
    administration: "1485230165830402168",
    human_resources: "1487518138974208142",
    officer: "1487394979478503565",
    head_moderator: "1477270727899222138",
    moderator: "1477270716050178169",
    division_administrator: "1485370389046759455",

    // Discord Information
    serverID: "1457749135187906665",

    // Channels IDs
    notifications: "",
    errors: "",
    rankings: "",
    joinings: "",

    // Stats Channels
    division_exp: "",
    division_level: "",
    server_members: "",
    group_members: "",
    hicom_members: "",
    officer_members: "",
    enlisted_members: "",

    // Roblox Information 
    groupID: "",
    newbieID: "",

    // Extra External Tokens
    RENDER_RESTART_TOKEN: process.env["Restart_Token"],
    GOOGLE_SHEET_API: process.env["Sheet_API"],
    http_token: process.env["Http_Token"]
};

module.exports = config;

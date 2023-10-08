document.addEventListener("DOMContentLoaded", function() {
    const ws = new WebSocket('ws://localhost:3000');

    const competitors = document.getElementById('competitors');
    const blueWInBox = document.getElementById('blueWInBox');
    const redWInBox = document.getElementById('redWInBox');
    const pool = document.getElementById('pool');
    const redCheer = document.getElementById('redCheer');
    const blueCheer = document.getElementById('blueCheer');
    
    const movementDistance = 3;
    let competitorsPosition = 57;
    let teamBlueStrength = 0;
    let teamRedStrength = 0;
    
    let teamBlue = { members: [] };
    let teamRed = { members: [] };
    
    var loopPull = window.setInterval(pull, 1000);
    
    ws.addEventListener('message', handleWebSocketMessage);
    
    function handleWebSocketMessage(event) {
        const data = JSON.parse(event.data);
        if (data.type === 'chat') {
            attributeTeam(data.comment, data.uniqueId, data.nickname, data.profilePictureUrl);
        } else if (data.type === 'like') {
            computeLike(data.uniqueId, data.likeCount);
        }
    }
    
    function attributeTeam(comment, uniqueId, nickname, profilePictureUrl) {
        const inTeamBlue = teamBlue.members.find(member => member.uniqueId === uniqueId);
        const inTeamRed = teamRed.members.find(member => member.uniqueId === uniqueId);
        if (comment === '#1' && !inTeamBlue && !inTeamRed) {
            teamBlue.members.push({ uniqueId, nickname, profilePictureUrl });
            console.log(comment, uniqueId, nickname, 'BLUE', teamBlue);
        } else if (comment === '#2' && !inTeamBlue && !inTeamRed) {
            teamRed.members.push({ uniqueId, nickname, profilePictureUrl });
            console.log(comment, uniqueId, nickname, 'RED', teamRed);
        }
    }
    
    function computeLike(uniqueId, likeCount) {
        const inTeamBlue = teamBlue.members.find(member => member.uniqueId === uniqueId);
        if (inTeamBlue) {
            buffTeamBlue(likeCount);
        } else {
            const inTeamRed = teamRed.members.find(member => member.uniqueId === uniqueId);
            if (inTeamRed) {
                buffTeamRed(likeCount);
            }
        }
    }
    
    function pull() {
        const competitorsObject = competitors.getBoundingClientRect();
        const blueWInBoxObject = blueWInBox.getBoundingClientRect();
        const redWInBoxObject = redWInBox.getBoundingClientRect();
        moveCompetitors();
    
        if (competitorsObject.top <= blueWInBoxObject.bottom) {
            clearInterval(loopPull);
            replaceImage(pool, '/src/assets/redCompetitor/redFalling.gif', 130, 100);
            replaceImage(competitors, '/src/assets/blueCompetitor/blueWon.png', 90, 90, '380px');
            replaceImage(blueCheer, '/src/assets/blueCompetitor/blueCheerWon.gif', 810, 90, '0%', '-1%');
        } else if (competitorsObject.bottom >= redWInBoxObject.top) {
            clearInterval(loopPull);
            replaceImage(pool, '/src/assets/blueCompetitor/blueFalling.gif', 130, 100);
            replaceImage(competitors, '/src/assets/redCompetitor/redWon.png', 90, 90, '650px');
            replaceImage(redCheer, '/src/assets/redCompetitor/redCheerWon.gif', 810, 90, '0%', '-1%');
        }
    }
    
    function moveCompetitors() {
        if (teamBlueStrength > teamRedStrength) {
            competitorsPosition -= movementDistance;
        } else if (teamRedStrength > teamBlueStrength) {
            competitorsPosition += movementDistance;
        }
        competitors.style.top = `${competitorsPosition}%`;
    }
    
    function buffTeamBlue(buff) {
        teamBlueStrength += buff;
        console.log('Blue team strength: '+teamBlueStrength);
    }
    
    function buffTeamRed(buff) {
        teamRedStrength += buff;
        console.log('Red team strength: '+teamRedStrength);
    }
    
    function replaceImage(element, src, height, width, top = '', bottom = '') {
        const newImage = new Image();
        newImage.src = src;
        newImage.alt = '';
        newImage.height = height;
        newImage.width = width;
        element.style.top = top;
        element.style.bottom = bottom;
        element.replaceChild(newImage, element.querySelector('img'));
    }
});

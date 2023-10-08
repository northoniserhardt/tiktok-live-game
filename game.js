document.addEventListener("DOMContentLoaded", function() {

    const ws = new WebSocket('ws://localhost:3000');

    const competitors = document.getElementById('competitors');
    const blueWInBox = document.getElementById('blueWInBox');
    const redWInBox = document.getElementById('redWInBox');
    const pool = document.getElementById('pool');
    const redCheer = document.getElementById('redCheer');
    const blueCheer = document.getElementById('blueCheer');

    const movementDistance = 0.5;

    let competitorsPosition = 57;

    let teamBlueStrength = 0;
    let teamRedStrength = 0;

    let teamBlue = {
        members: []
    };
    let teamRed = {
        members: []
    };

    var loopPull = window.setInterval(function() {
        pull();
    }, 1000);

    ws.addEventListener('message', (event) => {
        const data = JSON.parse(event.data);

        if (data.type === 'chat') {
            attributeTeam(data.comment, data.uniqueId, data.nickname, data.profilePictureUrl);
        } else if (data.type === 'like') {
            computeLike(data.uniqueId, data.likeCount);
        }
    });

    function attributeTeam(comment, uniqueId, nickname, profilePictureUrl) {
        const inTeamBlue = teamBlue.members.find(member => member.uniqueId === uniqueId);
        const inTeamRed = teamRed.members.find(member => member.uniqueId === uniqueId);
        console.log(comment);

        if (comment === '#1' && !inTeamBlue && !inTeamRed) {
            teamBlue.members.push({
                uniqueId: uniqueId,
                nickname: nickname,
                profilePictureUrl: profilePictureUrl
            });
            console.log(comment, uniqueId, nickname, 'BLUE', teamBlue);
        } else if (comment === '#2' && !inTeamBlue && !inTeamRed) {
            teamRed.members.push({
                uniqueId: uniqueId,
                nickname: nickname,
                profilePictureUrl: profilePictureUrl
            });
            console.log(comment, uniqueId, nickname, 'RED', teamRed);
        }
        comment = '';
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
        let competitorsObject = competitors.getBoundingClientRect();
        let blueWInBoxObject = blueWInBox.getBoundingClientRect();
        let redWInBoxObject = redWInBox.getBoundingClientRect();

        moveCompetitors();

        if (competitorsObject.top <= blueWInBoxObject.bottom) {
            clearInterval(loopPull);
            //gif red falling
            const newPoolGif = new Image();
            newPoolGif.src = '/src/assets/redCompetitor/redFalling.gif';
            newPoolGif.alt = '';
            newPoolGif.height = 130;
            newPoolGif.width = 100;
            const poolGif = pool.querySelector('img');
            pool.replaceChild(newPoolGif, poolGif);
            //blue happy
            const newCompetitorGif = new Image();
            newCompetitorGif.src = '/src/assets/blueCompetitor/blueWon.png';
            newCompetitorGif.alt = '';
            newCompetitorGif.height = 90;
            newCompetitorGif.width = 90;
            const competitorGif = competitors.querySelector('img');
            competitors.style.top = '380px';
            competitors.replaceChild(newCompetitorGif, competitorGif);
            //blue cheer happy
            const newCheerGif = new Image();
            newCheerGif.src = '/src/assets/blueCompetitor/blueCheerWon.gif';
            newCheerGif.alt = '';
            newCheerGif.height = 810;
            newCheerGif.width = 90;
            const CheerGif = blueCheer.querySelector('img');
            blueCheer.style.right = '0%';
            blueCheer.style.bottom = '-1%';
            blueCheer.replaceChild(newCheerGif, CheerGif);

        } else if (competitorsObject.bottom >= redWInBoxObject.top) {
            clearInterval(loopPull)
            //gif blue falling
            const newPoolGif = new Image();
            newPoolGif.src = '/src/assets/blueCompetitor/blueFalling.gif';
            newPoolGif.alt = '';
            newPoolGif.height = 130;
            newPoolGif.width = 100;
            const poolGif = pool.querySelector('img');
            pool.replaceChild(newPoolGif, poolGif);
            //red happy
            const newCompetitorGif = new Image();
            newCompetitorGif.src = '/src/assets/redCompetitor/redWon.png';
            newCompetitorGif.alt = '';
            newCompetitorGif.height = 90;
            newCompetitorGif.width = 90;
            const competitorGif = competitors.querySelector('img');
            competitors.style.top = '650px';
            competitors.replaceChild(newCompetitorGif, competitorGif);
            //red cheer happy
            const newCheerGif = new Image();
            newCheerGif.src = '/src/assets/redCompetitor/redCheerWon.gif';
            newCheerGif.alt = '';
            newCheerGif.height = 810;
            newCheerGif.width = 90;
            const CheerGif = redCheer.querySelector('img');
            redCheer.style.right = '0%';
            redCheer.style.right = '-1%';
            redCheer.replaceChild(newCheerGif, CheerGif);
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
        console.log(teamBlueStrength);
    }

    function buffTeamRed(buff) {
        teamRedStrength += buff;
        console.log(teamRedStrength);
    }

});
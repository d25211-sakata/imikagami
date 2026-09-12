// ========================================
// HTMLの要素を取得
// ========================================

// オープニング
const opening = document.querySelector(".opening");

// 会話
const messages = document.querySelectorAll(".message");

// 「へぇ」
const triggerHaunted = document.querySelector(".trigger-haunted");

// Story
const summaryTrigger = document.querySelector(".summary-trigger");

// 文字化け部分
const mojibakeTrigger = document.querySelector(".buruburu2");

// メニュー
const menu = document.querySelector(".menu");
const menuButton = document.querySelector(".menu-button");

// 音源
const bgm1 = document.querySelector("#bgm1");
const horrorSound = document.querySelector("#horror-sound");
const bgm2 = document.querySelector("#bgm2");
const bgm3 = document.querySelector("#bgm3");

// SOUNDボタン
const soundButton = document.querySelector("#sound-button");



// ========================================
// 状態を記録する変数
// ========================================

let hauntedStarted = false;
let summaryStarted = false;

let soundEnabled = false;

let musicChanged = false;
let bgm2Started = false;

// 今どの音楽段階にいるか
let audioPhase = "bgm1";



// ========================================
// 音量
// ========================================

const bgm1Volume = 0.2;
const effectVolume = 0.5;
const bgm2Volume = 0.25;
const bgm3Volume = 0.2;

bgm1.volume = bgm1Volume;
horrorSound.volume = effectVolume;
bgm2.volume = 0;
bgm3.volume = bgm3Volume;



// ========================================
// 最初のロゴ画面
// ========================================

// 一番上から開始
window.scrollTo(0, 0);


// 2秒後にフェードアウト開始
setTimeout(function() {

    opening.style.opacity = "0";

}, 2000);


// 4.5秒後に完全に消す
setTimeout(function() {

    opening.style.display = "none";

    document.documentElement.classList.remove("is-opening");
    document.body.classList.remove("is-opening");

    window.scrollTo(0, 0);

}, 4500);



// ========================================
// BGMフェードアウト
// ========================================

function fadeOut(audio, duration, callback) {

    const startVolume = audio.volume;

    const steps = 20;

    const intervalTime =
        duration / steps;

    let step = 0;


    const fade = setInterval(function() {

        step++;

        audio.volume =
            startVolume * (1 - step / steps);


        if (step >= steps) {

            clearInterval(fade);

            audio.pause();

            audio.currentTime = 0;

            audio.volume = startVolume;


            if (callback) {
                callback();
            }

        }

    }, intervalTime);

}



// ========================================
// BGMフェードイン
// ========================================

function fadeIn(audio, targetVolume, duration) {

    audio.volume = 0;

    audio.currentTime = 0;

    audio.play();


    const steps = 20;

    const intervalTime =
        duration / steps;

    let step = 0;


    const fade = setInterval(function() {

        step++;

        audio.volume =
            targetVolume * (step / steps);


        if (step >= steps) {

            clearInterval(fade);

            audio.volume =
                targetVolume;

        }

    }, intervalTime);

}



// ========================================
// 「へぇ」
// BGM1 → 効果音
// ========================================

function changeMusic() {

    // 2回実行しない
    if (musicChanged) {
        return;
    }

    musicChanged = true;


    // SOUND OFFの場合
    if (!soundEnabled) {

        audioPhase = "waiting-bgm2";

        return;
    }


    audioPhase = "effect";


    // BGM1を1.5秒で消す
    fadeOut(
        bgm1,
        1500,
        function() {


            // BGM2がもう始まっていたら
            // 効果音は鳴らさない
            if (bgm2Started) {
                return;
            }


            // 0.5秒無音
            setTimeout(function() {


                if (
                    !soundEnabled ||
                    bgm2Started
                ) {
                    return;
                }


                horrorSound.currentTime = 0;

                horrorSound.volume =
                    effectVolume;

                horrorSound.play();


            }, 500);

        }
    );

}



// ========================================
// 効果音が終了
// ========================================

horrorSound.addEventListener(
    "ended",
    function() {

        // ここではBGM2を流さない
        // 文字化けまで無音で待つ

        audioPhase = "waiting-bgm2";

    }
);



// ========================================
// 文字化けに来たらBGM2
// ========================================

function startBgm2() {

    // 1回しか開始しない
    if (bgm2Started) {
        return;
    }

    bgm2Started = true;

    audioPhase = "bgm2";


    // 効果音がまだ鳴っていたら止める
    horrorSound.pause();

    horrorSound.currentTime = 0;


    // SOUND OFFなら再生しない
    if (!soundEnabled) {
        return;
    }


    // BGM2を2秒でフェードイン
    fadeIn(
        bgm2,
        bgm2Volume,
        2000
    );

}



// ========================================
// BGM2が終了したらBGM3
// ========================================

bgm2.addEventListener(
    "ended",
    function() {

        audioPhase = "bgm3";


        if (!soundEnabled) {
            return;
        }


        bgm3.currentTime = 0;

        bgm3.volume =
            bgm3Volume;

        bgm3.play();

    }
);



// ========================================
// SOUND ON / OFF
// ========================================

soundButton.addEventListener(
    "click",
    function() {


        soundEnabled =
            !soundEnabled;


        // --------------------
        // SOUND ON
        // --------------------

        if (soundEnabled) {

            soundButton.textContent =
                "SOUND OFF";


            // まだ「へぇ」より前
            if (audioPhase === "bgm1") {

                bgm1.volume =
                    bgm1Volume;

                bgm1.play();

            }


            // 効果音の途中でON
            else if (
                audioPhase === "effect"
            ) {

                horrorSound.play();

            }


            // BGM2の段階
            else if (
                audioPhase === "bgm2"
            ) {

                bgm2.volume =
                    bgm2Volume;

                bgm2.play();

            }


            // BGM3の段階
            else if (
                audioPhase === "bgm3"
            ) {

                bgm3.volume =
                    bgm3Volume;

                bgm3.play();

            }


            // waiting-bgm2の場合は
            // あえて無音のまま

        }


        // --------------------
        // SOUND OFF
        // --------------------

        else {
            soundButton.textContent =
                "SOUND ON";
            bgm1.pause();
            horrorSound.pause();
            bgm2.pause();
            bgm3.pause();
        }
    }
);



// ========================================
// ハンバーガーメニュー
// ========================================

menuButton.addEventListener(
    "click",
    function() {

        menu.classList.toggle("open");

    }
);



// ========================================
// スクロール処理
// ========================================

function showMessages() {


    // ------------------------------------
    // 会話を順番に表示
    // ------------------------------------

    messages.forEach(
        function(message) {

            const messagePosition =
                message
                    .getBoundingClientRect()
                    .top;


            const screenPosition =
                window.innerHeight * 0.8;


            if (
                messagePosition <
                screenPosition
            ) {

                message.classList.add("show");

            }

        }
    );



    // ====================================
    // 「へぇ」
    // ====================================

    if (
        triggerHaunted &&
        !hauntedStarted
    ) {

        const triggerPosition =
            triggerHaunted
                .getBoundingClientRect()
                .top;


        const triggerPoint =
            window.innerHeight * 0.5;


        if (
            triggerPosition <
            triggerPoint
        ) {

            // 背景を暗くする
            document.body
                .classList
                .add("haunted");


            // BGM1 → 効果音
            changeMusic();


            hauntedStarted = true;

        }

    }



    // ====================================
    // 文字化け
    // ====================================

    if (
        mojibakeTrigger &&
        !bgm2Started
    ) {

        const mojibakePosition =
            mojibakeTrigger
                .getBoundingClientRect()
                .top;


        const mojibakePoint =
            window.innerHeight * 0.6;


        if (
            mojibakePosition <
            mojibakePoint
        ) {

            startBgm2();

        }

    }



    // ====================================
    // Story
    // ====================================

    if (
        summaryTrigger &&
        !summaryStarted
    ) {

        const summaryPosition =
            summaryTrigger
                .getBoundingClientRect()
                .top;


        const summaryPoint =
            window.innerHeight * 0.6;


        if (
            summaryPosition <
            summaryPoint
        ) {
            document.body
                .classList
                .add("summary-mode");
            document.body
                .classList
                .remove("haunted");
            summaryStarted = true;
        }
    }
}
// スクロールするたびに実行
window.addEventListener(
    "scroll",
    showMessages
);
// 最初にも一度実行
showMessages();

const footer =
    document.querySelector(".footer01");

const lastGhost =
    document.querySelector(".last-ghost");

let ghostPlayed = false;


const ghostObserver =
    new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (
                entry.isIntersecting &&
                !ghostPlayed
            ) {
                ghostPlayed = true;
                setTimeout(function() {
                    lastGhost.classList.add("show");
                    setTimeout(function() {
                        lastGhost.classList.remove("show");
                    }, 120);
                }, 800);
            }
        });
    }, {
        threshold: 0.7
    });


ghostObserver.observe(footer);
import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
    constructor() {
        super({
            key: 'GameOverScene'
        })
    }

    init(condition) {
        this.condition = condition
    }

    create() {
        let textStyle = {
            fill: "#ffffff",
            align: 'center',
            fontSize: 28,
            fontStyle: 'bold',
            padding: 0,
        }
        let textResult
        this.cameras.main.setBackgroundColor(0x000000)//0x2a0503)
        if (this.condition.result === 'win') {
            textResult = "VICTORY"
            //this.overText = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'atlas', 'win')
        } else if (this.condition.result === 'lose') {
            textResult = "DEFEAT"
            //this.overText = this.add.image(this.cameras.main.width / 2, this.cameras.main.height / 2 - 64, 'atlas', 'gameOver')
        }
        this.input.keyboard.on('keydown_ENTER', function (event) {
            location.reload()
        })

        this.cameras.main.stopFollow()
        this.cameras.main.setScroll(0, 0)

        const centerX = this.cameras.main.centerX
        const centerY = this.cameras.main.centerY

        var highscore;
        let savedHighscore = localStorage.getItem("highscore");
        if(savedHighscore && JSON.parse(savedHighscore) > 0){
            if(this.condition.score > JSON.parse(savedHighscore)){
                localStorage.setItem("highscore",this.condition.score)
                highscore = this.condition.score
            } else {
                highscore = JSON.parse(savedHighscore)
            }
        } else {
            localStorage.setItem("highscore",this.condition.score)
            highscore = this.condition.score
        }

        const resultText = this.add.text(centerX, centerY - 45, textResult, textStyle)
        const scoreText = this.add.text(centerX, centerY-15, `Score: ${this.condition.score}`, {...textStyle,fontSize: 26})
        const highscoreText = this.add.text(centerX, centerY + 15, `Highscore: ${highscore}`, {...textStyle,fontSize: 18})
        const restartText = this.add.text(centerX, centerY + 45, "- press ENTER to restart -", {...textStyle,fontSize: 18})

        // Set origin to center of text objects
        resultText.setOrigin(0.5)
        scoreText.setOrigin(0.5)
        highscoreText.setOrigin(0.5)
        restartText.setOrigin(0.5)


        //  结束文字
        /*  this.add.text(100, 100, textResult, textStyle)
         this.add.text(100, 200, `Score: ${this.condition.score} `, textStyle) */

    }


}

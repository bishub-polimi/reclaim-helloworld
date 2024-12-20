"use client"

import PreLoadScene from "../game/scene/PreLoadScene"
import GameScene from "../game/scene/GameScene"
import gameOverScene from "../game/scene/GameOverScene"
import BlankScene from "../game/scene/BlankScene"
import Phaser from "phaser";
import { usePhaserGame } from "@/hooks/usePhaserGame"
import { useEffect } from "react"
import { useAccount, useReadContract } from "wagmi"
import artifacts from "../abi/Attestor.json";
import addresses from "../shared/data/addresses.json";

const config = {
    // For more settings see <https://github.com/photonstorm/phaser/blob/master/src/boot/Config.js>
    type: Phaser.AUTO,
    pixelArt: false,
    roundPixels: true,
    parent: 'game',
    title: 'Phaser3 Mario',
    width: 700,
    height: 224,
    // width: 3840,
    // height: 624,
    fps: 60,
    scale: {
        mode: Phaser.Scale.WIDTH_CONTROLS_HEIGHT,
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false // 调试开启 arcade sprite 会有边框提示
        }
    },

    scene: [
        // LoadingScene,
        // DoubleJumpScene,
        PreLoadScene,
        GameScene,
        gameOverScene,
        BlankScene
    ]
};


export default function GameSection() {

    const account = useAccount();
    const { data: balance } = useReadContract({
        address: addresses["Attestor"] as `0x${string}`,
        abi: artifacts.abi,
        functionName: 'balanceOf',
        args: [account.address,0],
    })

    const game = usePhaserGame(config);

    useEffect(()=>{
        if(balance && balance > BigInt(0)){
            localStorage.setItem("hasToken", "true")
        }     
    }, [balance]) 

    return (
        <div className="w-full">
            <div id="game">

            </div>
        </div>
    );
}

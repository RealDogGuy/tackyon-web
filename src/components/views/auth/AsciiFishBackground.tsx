/*
Copyright 2026 New Vector Ltd.

SPDX-License-Identifier: AGPL-3.0-only OR GPL-3.0-only OR LicenseRef-Element-Commercial
Please see LICENSE files in the repository root for full details.
*/

import React, { useEffect, useRef } from "react";

const FISH_BASE = ["<°)))><", "<o)))><"];
const MAX_FISH = 24;
const MIN_SPAWN_MS = 300;
const MAX_SPAWN_MS = 1200;
const MIN_DURATION_S = 14;
const MAX_DURATION_S = 32;
const MIN_FONT_PX = 14;
const MAX_FONT_PX = 28;
const LANE_COUNT = 14;
const EDGE_MARGIN_PX = 140;

function randomBetween(min: number, max: number): number {
    return min + Math.random() * (max - min);
}

function randomInt(min: number, max: number): number {
    return Math.floor(randomBetween(min, max + 1));
}

export default function AsciiFishBackground(): React.ReactNode {
    const rootRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (window.matchMedia?.("(prefers-reduced-motion: reduce)").matches) {
            return;
        }

        let timer: number | undefined;
        let stopped = false;

        const scheduleSpawn = (): void => {
            timer = window.setTimeout(
                spawnFish,
                randomInt(MIN_SPAWN_MS, MAX_SPAWN_MS),
            );
        };

        const spawnFish = (): void => {
            if (stopped) return;
            const root = rootRef.current;
            if (!root) {
                scheduleSpawn();
                return;
            }

            if (root.childElementCount < MAX_FISH) {
                const fish = document.createElement("span");
                const goLeftToRight = Math.random() > 0.5;
                const viewportWidth = window.innerWidth;
                const laneHeightPercent = 100 / LANE_COUNT;
                const lane = randomInt(0, LANE_COUNT - 1);
                const laneJitter = randomBetween(-laneHeightPercent * 0.25, laneHeightPercent * 0.25);

                fish.className = "mx_AsciiFishBackground_fish";
                fish.textContent = FISH_BASE[randomInt(0, FISH_BASE.length - 1)];
                fish.style.setProperty("--start-x", `${goLeftToRight ? -EDGE_MARGIN_PX : viewportWidth + EDGE_MARGIN_PX}px`);
                fish.style.setProperty("--end-x", `${goLeftToRight ? viewportWidth + EDGE_MARGIN_PX : -EDGE_MARGIN_PX}px`);
                fish.style.top = `${Math.min(96, Math.max(4, (lane + 0.5) * laneHeightPercent + laneJitter))}%`;
                fish.style.setProperty("--flip", goLeftToRight ? "-1" : "1");
                fish.style.fontSize = `${randomInt(MIN_FONT_PX, MAX_FONT_PX)}px`;
                fish.style.opacity = randomBetween(0.24, 0.7).toFixed(2);
                fish.style.animationDuration = `${randomBetween(MIN_DURATION_S, MAX_DURATION_S).toFixed(2)}s`;

                fish.addEventListener("animationend", () => {
                    fish.remove();
                });
                root.appendChild(fish);
            }

            scheduleSpawn();
        };

        scheduleSpawn();

        return () => {
            stopped = true;
            if (timer !== undefined) {
                window.clearTimeout(timer);
            }
            rootRef.current?.replaceChildren();
        };
    }, []);

    return (
        <>
            <style>{`
                .mx_AsciiFishBackground {
                    position: fixed;
                    inset: 0;
                    overflow: hidden;
                    pointer-events: none;
                }

                .mx_AsciiFishBackground_fish {
                    position: absolute;
                    left: 0;
                    top: 0;
                    white-space: pre;
                    line-height: 1;
                    transform-origin: center;
                    will-change: transform;
                    user-select: none;
                    color: rgba(255, 255, 255, 0.3);
                    font-family:
                        system-ui,
                        "Segoe UI",
                        "Noto Sans",
                        "Noto Sans CJK JP",
                        "Yu Gothic",
                        "Meiryo",
                        sans-serif;
                    animation-name: mx_AsciiFishBackground_swim;
                    animation-timing-function: linear;
                    animation-fill-mode: forwards;
                }

                @keyframes mx_AsciiFishBackground_swim {
                    from {
                        transform: translate3d(var(--start-x), 0, 0) scaleX(var(--flip));
                    }
                    to {
                        transform: translate3d(var(--end-x), 0, 0) scaleX(var(--flip));
                    }
                }
            `}</style>
            <div className="mx_AsciiFishBackground" ref={rootRef} aria-hidden="true" />
        </>
    );
}

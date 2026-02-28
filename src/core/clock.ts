export class FixedStepClock {
    readonly fixedDT: number;
    private accumulator = 0;
    private lastTime = 0;
    private timeElapsed = 0;

    constructor(fixedDT: number) {
        this.fixedDT = fixedDT;
        this.lastTime = performance.now() / 1000;
    }

    tick(): number {
        const now = performance.now() / 1000;
        let delta = now - this.lastTime;
        this.lastTime = now;
        this.timeElapsed += delta;

        // spiral of death protection
        if (delta > 0.25) delta = 0.25;

        this.accumulator += delta;

        let steps = 0;
        while (this.accumulator >= this.fixedDT) {
            this.accumulator -= this.fixedDT;
            steps++;
        }

        return steps;
    }

    public get elapsedTime(): number {
        return this.timeElapsed;
    }
}

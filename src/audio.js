/*
    C	    C#	    D	    Eb	    E	    F	    F#	    G	    G#	    A	    Bb	    B
0	16.35	17.32	18.35	19.45	20.60	21.83	23.12	24.50	25.96	27.50	29.14	30.87
1	32.70	34.65	36.71	38.89	41.20	43.65	46.25	49.00	51.91	55.00	58.27	61.74
2	65.41	69.30	73.42	77.78	82.41	87.31	92.50	98.00	103.8	110.0	116.5	123.5
3	130.8	138.6	146.8	155.6	164.8	174.6	185.0	196.0	207.7	220.0	233.1	246.9
4	261.6	277.2	293.7	311.1	329.6	349.2	370.0	392.0	415.3	440.0	466.2	493.9
5	523.3	554.4	587.3	622.3	659.3	698.5	740.0	784.0	830.6	880.0	932.3	987.8
6	1047	1109	1175	1245	1319	1397	1480	1568	1661	1760	1865	1976
7	2093	2217	2349	2489	2637	2794	2960	3136	3322	3520	3729	3951
8	4186	4435	4699	4978	5274	5588	5920	6272	6645	7040	7459	7902

*/

const octave0_frequencies = [16.35, 17.32, 18.35, 19.45, 20.60, 21.83, 23.12, 24.50, 25.96, 27.50, 29.14, 30.87]
const BASE_OCTAVE = 1
const MAX_VOLUME = 0.2

const audio_ctx = new AudioContext()
const compressor = audio_ctx.createDynamicsCompressor()
const osc = audio_ctx.createOscillator()
const gainNode = audio_ctx.createGain()
osc.type = "triangle"

// osc > gain > compressor > out
osc.connect(gainNode)
gainNode.connect(compressor)
compressor.connect(audio_ctx.destination)
osc.start()

gainNode.gain.setValueAtTime(0.00001, audio_ctx.currentTime)

// 

export function play(sfx_index) {
    const note_speed = 24 / 128

    for (let i = 0; i < 32; i++) {
        const addr = vm.addr.sfx + sfx_index * 68 + i * 2
        const note = peek2(addr)
        const volume = Math.max(1 / 1000, (note & 0b00001110_00000000) >> 9)
        const pitch_number = note & 0b00000000_00111111
        const base_freq = octave0_frequencies[pitch_number % octave0_frequencies.length]
        const octave = BASE_OCTAVE + Math.floor(pitch_number / octave0_frequencies.length)
        const frequency = base_freq * Math.max(1, (2 ** octave))

        const note_time_offset = audio_ctx.currentTime + i * note_speed
        osc.frequency.setValueAtTime(frequency, note_time_offset)

        gainNode.gain.exponentialRampToValueAtTime((volume / 7) * MAX_VOLUME, note_time_offset)
        // gainNode.gain.setValueAtTime((volume / 7) * MAX_VOLUME, note_time_offset)
    }

    gainNode.gain.exponentialRampToValueAtTime(.000001, audio_ctx.currentTime + 33 * note_speed)


    // gainNode.gain.setValueAtTime(0.00001, audio_ctx.currentTime)
    // gainNode.gain.exponentialRampToValueAtTime(1.0, audio_ctx.currentTime + 0.1)
    // gainNode.gain.exponentialRampToValueAtTime(0.00001, audio_ctx.currentTime + 1.0)


    // Set Frequency
    // osc.frequency.setValueAtTime(val, audio_ctx.currentTime + when)

    // Set Volume
    // gainNode.gain.exponentialRampToValueAtTime(val, audio_ctx.currentTime + when)

    // Play
    // osc.start()

    // Stop
    // gainNode.gain.setTargetAtTime(1 / 1000, audio_ctx.currentTime + when - 0.05, 0.02)
    // osc.stop(audio_ctx.currentTime + when)
}

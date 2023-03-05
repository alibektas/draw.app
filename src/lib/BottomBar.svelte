<script lang="ts">
	import { onDestroy } from 'svelte';
	import { errorCount, warningCount, lastKeyStroke, scene_state } from './stores/stores';

	let time = '';
	let pastInFrames = 0;
	let key_stroke_timer_on = false;

	function animate() {
		requestAnimationFrame(animate);
		time = new Date().toLocaleTimeString();

		if (key_stroke_timer_on) {
			if (pastInFrames++ > 100) {
				pastInFrames = 0;
				key_stroke_timer_on = false;
				lastKeyStroke.set({
					text: '',
					type: 'empty'
				});
			}
		}
	}

	lastKeyStroke.subscribe((v) => {
		if (v.type !== 'empty') {
			key_stroke_timer_on = true;
			pastInFrames = 0;
		} else {
			key_stroke_timer_on = false;
		}
	});

	animate();

	let current_mode_text = 'ERR';

	const state_unsub = scene_state.subscribe((state) => {
		if (state === 'Select') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Select;
		} else if (state === 'Translate') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Translate;
		} else if (state === 'Rotate') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Rotate;
		} else if (state === 'Link') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Link;
		} else if (state === 'Unlink') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Unlink;
		} else if (state === 'Parent') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Parent;
		} else if (state === 'Explode') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Explode;
		} else if (state === 'Nodes') {
			current_mode_text = window.sessionConfig.ui_texts.Mode.Nodes;
		} else {
			throw new Error('Unknown  state ' + state);
		}
	});

	function toggleProblems() {
		window.dispatchEvent(new Event('toggle-problems'));
	}

	onDestroy(() => {
		state_unsub();
	});
</script>

<div id="bottom-bar">
	<div id="time">{time}</div>
	<div>{current_mode_text}</div>
	<div
		on:click={toggleProblems}
		on:keydown={() => {
			/*FUT001*/
		}}
	>
		{window.sessionConfig.ui_texts.ProblemsBar.ErrorTitle}:{$errorCount}
		{window.sessionConfig.ui_texts.ProblemsBar.WarningTitle}:{$warningCount}
	</div>
	<div id="keystrokes" class={$lastKeyStroke.type}>
		{$lastKeyStroke.text}
	</div>
</div>

<style lang="less">
	#bottom-bar > div {
		flex: 0 0 auto;
		padding-left: 20px;
		padding-right: 10px;
	}

	#bottom-bar {
		display: flex;
		flex-direction: row-reverse;
		justify-content: flex-start;
		/* background-color: red; */
	}

	#keystrokes.success {
		background-color: #00ff00;
	}

	#keystrokes.fail {
		background-color: #d32d2d;
	}

	#keystrokes.empty {
		background-color: transparent;
	}
</style>

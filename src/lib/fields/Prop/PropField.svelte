<script lang="ts">


	import Expandable from '$lib/ui/Expandable.svelte';
	import type { INumberField } from '$lib/fields/base/NumberField/INumberField';
	import type { IVector3Field } from '$lib/fields/base/Vector3Field/IVector3Field';
	import { ComponentStateType } from '$lib/fields/base/Field/FieldTypes';
	import type { IBooleanField } from '$lib/fields/base/BoolField/IBooleanField';
	import type { ITextField } from '$lib/fields/base/TextField/ITextField';
	import TextField from '$lib/fields/base/TextField/TextField.svelte';
	import BooleanField from '$lib/fields/base/BoolField/BooleanField.svelte';
	import Vector3Field from '$lib/fields/base/Vector3Field/Vector3Field.svelte';
	import { scene_state } from '$lib/stores/stores';
	import { get } from 'svelte/store';
	import { MathUtils } from 'three';
	import type { Prop } from "$lib/wrapper/Base";
	import { Scene } from "$lib/wrapper/prop/scene/Scene";
	import { SelectState } from "$lib/wrapper/prop/scene/state/SelectState";

	export let obj: Prop;

	const infos = window.sessionConfig.info_texts.Object3D;
	const errs = window.sessionConfig.errs.PropFieldErrorType;
	const warns = window.sessionConfig.warns.PropFieldWarningType;

	obj.addEventListener('update-name', () => {
		console.warn('update-name not implemented');
	});

	obj.addEventListener('update-visible', () => {
		console.warn('update-name not implemented');
	});

	obj.addEventListener('update-position', () => {
		// const v = obj.position;
		console.warn('Update-position not implemented.');
	});

	obj.addEventListener('update-rotation', () => {
		// const v = obj.rotation;
		console.warn('Update-rotation not implemented.');
	});

	const rotation_field_options: IVector3Field<INumberField> = {
		x: {
			onchange: (val) => {
				obj.rotation.set(MathUtils.degToRad(val), obj.rotation.y, obj.rotation.z);
				window.scene.render();
			},
			step: 0.1,
			user_mem: obj.input_rotation.x,
			ui_text: infos.RotationField,
			uuid: obj.uuid,
			state: ComponentStateType.INFO,
			errors: {
				MaxValueError: errs.RotationFieldError.x.MaxValueError,
				MinValueError: errs.RotationFieldError.x.MinValueError
			},
			warnings: {
				MaxValueWarning: warns.RotationFieldWarning.x.MaxValueWarning,
				MinValueWarning: warns.RotationFieldWarning.x.MinValueWarning
			}
		},
		y: {
			onchange: (val) => {
				obj.rotation.set(obj.rotation.x, MathUtils.degToRad(val), obj.rotation.z);
				window.scene.render();
			},
			step: 0.1,
			ui_text: infos.RotationField,
			uuid: obj.uuid,
			state: ComponentStateType.INFO,
			user_mem: obj.input_rotation.y,
			errors: {
				MaxValueError: errs.RotationFieldError.y.MaxValueError,
				MinValueError: errs.RotationFieldError.y.MinValueError
			},
			warnings: {
				MaxValueWarning: warns.RotationFieldWarning.y.MaxValueWarning,
				MinValueWarning: warns.RotationFieldWarning.y.MinValueWarning
			}
		},
		z: {
			onchange: (val) => {
				obj.rotation.set(obj.rotation.x, obj.rotation.y, MathUtils.degToRad(val));
				window.scene.render();
			},
			step: 0.1,
			ui_text: infos.RotationField,
			uuid: obj.uuid,
			user_mem: obj.input_rotation.z,
			state: ComponentStateType.INFO,
			errors: {
				MaxValueError: errs.RotationFieldError.z.MaxValueError,
				MinValueError: errs.RotationFieldError.z.MinValueError
			},
			warnings: {
				MaxValueWarning: warns.RotationFieldWarning.z.MaxValueWarning,
				MinValueWarning: warns.RotationFieldWarning.z.MinValueWarning
			}
		}
	};

	const position_field_options: IVector3Field<INumberField> = {
		x: {
			onchange: (val) => {
				obj.position.setX(val);
				window.scene.render();
			},
			step: 0.1,
			user_mem: obj.input_position.x,
			ui_text: infos.PositionField,
			uuid: obj.uuid,
			state: ComponentStateType.INFO,
			errors: {
				MaxValueError: errs.PositionFieldError.z.MaxValueError,
				MinValueError: errs.PositionFieldError.z.MinValueError
			},
			warnings: {
				MaxValueWarning: warns.PositionFieldWarning.z.MaxValueWarning,
				MinValueWarning: warns.PositionFieldWarning.z.MinValueWarning
			}
		},
		y: {
			onchange: (val) => {
				obj.position.setY(val);
				window.scene.render();
			},
			step: 0.1,
			user_mem: obj.input_position.y,
			ui_text: infos.PositionField,
			uuid: obj.uuid,
			state: ComponentStateType.INFO,
			errors: {
				MaxValueError: errs.PositionFieldError.y.MaxValueError,
				MinValueError: errs.PositionFieldError.y.MinValueError
			},
			warnings: {
				MaxValueWarning: warns.PositionFieldWarning.y.MaxValueWarning,
				MinValueWarning: warns.PositionFieldWarning.y.MinValueWarning
			}
		},
		z: {
			onchange: (val) => {
				obj.position.setZ(val);
				window.scene.render();
			},
			step: 0.1,
			user_mem: obj.input_position.z,
			ui_text: infos.PositionField,
			uuid: obj.uuid,
			state: ComponentStateType.INFO,
			errors: {
				MaxValueError: errs.PositionFieldError.z.MaxValueError,
				MinValueError: errs.PositionFieldError.z.MinValueError
			},
			warnings: {
				MaxValueWarning: warns.PositionFieldWarning.z.MaxValueWarning,
				MinValueWarning: warns.PositionFieldWarning.z.MinValueWarning
			}
		}
	};

	const obj_visible_options: IBooleanField = {
		ui_text: infos.IsHiddenField,
		state: ComponentStateType.INFO,
		user_mem: obj.input_ishidden,
		uuid: obj.uuid,
		onchange: (v) => {
			obj.visible = !v;
			window.scene.render();
		},
		errors: {},
		warnings: {}
	};

	const obj_name_options: ITextField = {
		state: ComponentStateType.INFO,
		uuid: obj.uuid,
		user_mem: obj.input_name,
		onchange: (v) => {
			obj.name = v;
		},
		ui_text: infos.NameField,
		errors: {},
		warnings: {}
	};
</script>

<Expandable ui_text={infos.Expandable} state={ComponentStateType.INFO} isExpanded={true}>
	<div class="content">
		<div id="parent-field">
			<div id="parent-title">Parent</div>
			<div
				on:keydown={() => {
					/**FUT001*/
				}}
				on:click={() => {
					if (obj.parent !== null) {
						if (get(scene_state) === 'Select') {
							if (obj.parent instanceof Scene) {
								SelectState.instance.on_select_all();
							} else {
								SelectState.instance.select_object(obj.parent);
							}
						}
					}
				}}
			>
				{obj.parent !== null ? obj.parent.name : 'No Parent'}
			</div>
		</div>
		<!-- Name field -->
		<TextField opt={obj_name_options} />
		<!-- Is the object visible ? field -->
		<BooleanField opt={obj_visible_options} />
		<!-- POSITIONFIELD -->
		<Vector3Field opt={position_field_options} />
		<!-- ROTATIONFIELD -->
		<Vector3Field opt={rotation_field_options} />
	</div>
</Expandable>

<!-- TODO
<AddressField
	{obj}
	isExpanded={address_field_is_open}
	on:click={() => {
		address_field_is_open = !address_field_is_open;
	}}
/> -->
<style lang="less">
	#parent-field {
		#parent-title {
			text-align: center;
		}

		display: grid;
		grid-template-columns: 150px 150px;
		margin-bottom: 10px;
	}

	.content {
		display: flex;
		flex-direction: column;
	}
</style>

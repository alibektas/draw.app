/**
 * Whether one can apply transformation and translations
 * to an object.
 * `POS` stands for position
 * `ROT` stands for rotation
 * `SX` stands for scale.
 * The prefix `NO` means the corresponding transform is not allowed.
 */
enum TransformLock {
	POS_ROT_SX,
	NO_POS_ROT_SX,
	POS_NO_ROT_SX,
	POS_ROT_NO_SX,
	NO_POS_NO_ROT_SX,
	NO_POS_ROT_NO_SX,
	POS_NO_ROT_NO_SX,
	NO_POS_NO_ROT_NO_SX
}

export { TransformLock };

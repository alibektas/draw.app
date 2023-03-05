enum Orientation {
	HORIZONTAL,
	VERTICAL
}

/**
 * @param LEFTMOST  Panel's one side touches the left boundary of the parent div.
 * @param RIGHT Panel's one side touches the right boundary of the parent div.
 */
enum VerticalOrientation {
	LEFT, // Panel's one side touches the left boundary of the parent div. ,
	RIGHT // Panel's one side touches the right boundary of the parent div.
}

/**
 * @param TOP -  Panel is at the top
 * @param BOTTOM - Panel is at the bottom
 */
enum HorizontalOrientation {
	TOP,
	BOTTOM
}

export { Orientation, HorizontalOrientation, VerticalOrientation };

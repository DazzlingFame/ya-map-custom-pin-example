export type Coordinates = {
	lat: number;
	lon: number;
};

export type Description = {
	title: string;
	isHidden?: boolean;
};


export type PinData = {
	key: string;
	position: Coordinates;
	description: Description;
}

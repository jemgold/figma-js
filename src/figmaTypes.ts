export interface Global {
  /** a string uniquely identifying this node within the document */
  readonly id: string;
  /** the name given to the node by the user in the tool. */
  readonly name: string;
  /** whether or not the node is visible on the canvas */
  readonly visible: boolean;
  /** the type of the node, refer to table below for details */
  readonly type: NodeType;
}

export enum NodeType {
  DOCUMENT,
  CANVAS,
  FRAME,
  GROUP,
  VECTOR,
  BOOLEAN,
  STAR,
  LINE,
  ELLIPSE,
  REGULAR_POLYGON,
  RECTANGLE,
  TEXT,
  SLICE,
  COMPONENT,
  INSTANCE
}

export type Node =
  | Document
  | Canvas
  | Frame
  | Group
  | Vector
  | BooleanGroup
  | Star
  | Line
  | Ellipse
  | RegularPolygon
  | Rectangle
  | Text
  | Slice
  | Component
  | Instance;

/** Node Properties */

/** The root node */
export interface Document extends Global {
  readonly type: NodeType.DOCUMENT;
  /** An array of canvases attached to the document */
  readonly children: ReadonlyArray<Node>;
}

/** Represents a single page */
export interface Canvas extends Global {
  readonly type: NodeType.CANVAS;
  /** An array of top level layers on the canvas */
  readonly children: ReadonlyArray<Node>;
  /** Background color of the canvas */
  readonly backgroundColor: Color;
  /** An array of export settings representing images to export from the canvas */
  readonly exportSettings: ReadonlyArray<ExportSetting>;
}

export interface FrameBase extends Global {
  /** An array of nodes that are direct children of this node */
  readonly children: ReadonlyArray<Node>;
  /** Background color of the node */
  readonly backgroundColor: Color;
  /**
   * An array of export settings representing images to export from node
   * @default []
   */
  readonly exportSettings: ReadonlyArray<ExportSetting>;
  /**
   * How this node blends with nodes behind it in the scene
   * (see blend mode section for more details)
   */
  readonly blendMode: BlendMode;
  /**
   * Keep height and width constrained to same ratio
   * @default false
   */
  readonly preserveRatio: boolean;
  /** Horizontal and vertical layout constraints for node */
  readonly constraints: LayoutConstraint;
  /**
   * Node ID of node to transition to in prototyping
   * @default null
   */
  readonly transitionNodeID: string | null;
  /**
   * Opacity of the node
   * @default 1
   */
  readonly opacity: number;
  /** Bounding box of the node in absolute space coordinates */
  readonly absoluteBoundingBox: Rectangle;
  /** Does this node clip content outside of its bounds? */
  readonly clipsContent: boolean;
  /**
   * An array of layout grids attached to this node (see layout grids section
   * for more details). GROUP nodes do not have this attribute
   * @default []
   */
  readonly layoutGrids: ReadonlyArray<LayoutGrid>;
  /**
   * An array of effects attached to this node
   * (see effects sectionfor more details)
   * @default []
   */
  readonly effects: ReadonlyArray<Effect>;
  /**
   * Does this node mask sibling nodes in front of it?
   * @default false
   */
  readonly isMask: boolean;
}

/** A node of fixed size containing other nodes */
export interface Frame extends FrameBase {
  readonly type: NodeType.FRAME;
}

/** A logical grouping of nodes */
export interface Group extends FrameBase {
  readonly type: NodeType.GROUP;
}

export interface VectorBase extends Global {
  /**
   * An array of export settings representing images to export from node
   * @default []
   */
  readonly exportSettings: ReadonlyArray<ExportSetting>;
  /**
   * How this node blends with nodes behind it in the scene
   * (see blend mode section for more details)
   */
  readonly blendMode: BlendMode;
  /**
   * Keep height and width constrained to same ratio
   * @default false
   */
  readonly preserveRatio: boolean;
  /**
   * Horizontal and vertical layout constraints for node
   */
  readonly constraints: LayoutConstraint;
  /**
   * Node ID of node to transition to in prototyping
   * @default null
   */
  readonly transitionNodeID: string | null;
  /**
   * Opacity of the node
   * @default 1
   */
  readonly opacity: number;
  /** Bounding box of the node in absolute space coordinates */
  readonly absoluteBoundingBox: Rectangle;
  /**
   * An array of effects attached to this node
   * (see effects sectionfor more details)
   * @default []
   */
  readonly effects: ReadonlyArray<Effect>;
  /**
   * Does this node mask sibling nodes in front of it?
   * @default false
   */
  readonly isMask: boolean;
  /**
   * An array of fill paints applied to the node
   * @default []
   */
  readonly fills: ReadonlyArray<Paint>;
  /**
   * An array of stroke paints applied to the node
   * @default []
   */
  readonly strokes: ReadonlyArray<Paint>;
  /** The weight of strokes on the node */
  readonly strokeWeight: number;
  /**
   * Where stroke is drawn relative to the vector outline as a string enum
   * "INSIDE": draw stroke inside the shape boundary
   * "OUTSIDE": draw stroke outside the shape boundary
   * "CENTER": draw stroke centered along the shape boundary
   */
  readonly strokeAlign: 'INSIDE' | 'OUTSIDE' | 'CENTER';
}

/** A vector network, consisting of vertices and edges */
export interface Vector extends VectorBase {
  readonly type: NodeType.VECTOR;
}

/** A group that has a boolean operation applied to it */
export interface BooleanGroup extends VectorBase {
  readonly type: NodeType.BOOLEAN;
  /** An array of nodes that are being boolean operated on */
  readonly children: ReadonlyArray<Node>;
}

/** A regular star shape */
export interface Star extends VectorBase {
  readonly type: NodeType.STAR;
}

/** A straight line */
export interface Line extends VectorBase {
  readonly type: NodeType.LINE;
}

/** An ellipse */
export interface Ellipse extends VectorBase {
  readonly type: NodeType.ELLIPSE;
}

/** A regular n-sided polygon */
export interface RegularPolygon extends VectorBase {
  readonly type: NodeType.REGULAR_POLYGON;
}

/** A rectangle */
export interface Rectangle extends VectorBase {
  readonly type: NodeType.RECTANGLE;
  /** Radius of each corner of the rectangle */
  readonly cornerRadius: number;
}

/** A text box */
export interface Text extends VectorBase {
  readonly type: NodeType.TEXT;
  /** Text contained within text box */
  readonly characters: string;
  /**
   * Style of text including font family and weight (see type style
   * section for more information)
   */
  readonly style: TypeStyle;
  /**
   * Array with same number of elements as characeters in text box,
   * each element is a reference to the styleOverrideTable defined
   * below and maps to the corresponding character in the characters
   * field. Elements with value 0 have the default type style
   */
  readonly characterStyleOverrides: ReadonlyArray<number>;
  /** Map from ID to TypeStyle for looking up style overrides */
  readonly styleOverrideTable: { readonly [index: number]: TypeStyle };
}

/** A rectangular region of the canvas that can be exported */
export interface Slice extends Global {
  readonly type: NodeType.SLICE;
  /** An array of export settings representing images to export from this node */
  readonly exportSettings: ReadonlyArray<ExportSetting>;
  /** Bounding box of the node in absolute space coordinates */
  readonly absoluteBoundingBox: Rectangle;
}

/** A node that can have instances created of it that share the same properties */
export interface Component extends FrameBase {
  readonly type: NodeType.COMPONENT;
}

/**
 * An instance of a component, changes to the component result in the same
 * changes applied to the instance
 */
export interface Instance extends FrameBase {
  readonly type: NodeType.INSTANCE;
  /**
   * ID of component that this instance came from, refers to components
   * table (see endpoints section below)
   */
  readonly componentId: string;
}

// Types

/** An RGBA color */
export interface Color {
  /** Red channel value, between 0 and 1 */
  readonly r: number;
  /** Green channel value, between 0 and 1 */
  readonly g: number;
  /** Blue channel value, between 0 and 1 */
  readonly b: number;
  /** Alpha channel value, between 0 and 1 */
  readonly a: number;
}

/** Format and size to export an asset at */
export interface ExportSetting {
  /** File suffix to append to all filenames */
  readonly suffix: 'string';
  /** Image type, string enum */
  readonly format: 'JPG' | 'PNG' | 'SVG';
  /** Constraint that determines sizing of exported asset */
  readonly constraint: Constraint;
}

/** Sizing constraint for exports */
export interface Constraint {
  /**
   * Type of constraint to apply; string enum with potential values below
   * "SCALE": Scale by value
   * "WIDTH": Scale proportionally and set width to value
   * "HEIGHT": Scale proportionally and set height to value
   */
  readonly type: 'SCALE' | 'WIDTH' | 'HEIGHT';
  /** See type property for effect of this field */
  readonly value: number;
}

/** A rectangle that expresses a bounding box in absolute coordinates */
export interface Rectangle {
  /** X coordinate of top left corner of the rectangle */
  readonly x: number;
  /** Y coordinate of top left corner of the rectangle */
  readonly y: number;
  /** Width of the rectangle */
  readonly width: number;
  /** Height of the rectangle */
  readonly height: number;
}

/**
 * Enum describing how layer blends with layers below
 * This type is a string enum with the following possible values
 */
export enum BlendMode {
  'PASS_THROUGH' /** (Only applicable to objects with children) */,
  'NORMAL',

  /** Darken: */
  'DARKEN',
  'MULTIPLY',
  'LINEAR_BURN',
  'COLOR_BURN',

  /** Lighten: */
  'LIGHTEN',
  'SCREEN',
  'LINEAR_DODGE',
  'COLOR_DODGE',

  /** Contrast: */
  'OVERLAY',
  'SOFT_LIGHT',
  'HARD_LIGHT',

  /** Inversion: */
  'DIFFERENCE',
  'EXCLUSION',

  /** Component: */
  'HUE',
  'SATURATION',
  'COLOR',
  'LUMINOSITY'
}

/** Layout constraint relative to containing Frame */
export interface LayoutConstraint {
  /**
   * Vertical constraint as an enum
   * "TOP": Node is laid out relative to top of the containing frame
   * "BOTTOM": Node is laid out relative to bottom of the containing frame
   * "CENTER": Node is vertically centered relative to containing frame
   * "TOP_BOTTOM": Both top and bottom of node are constrained relative to containing frame (node stretches with frame)
   * "SCALE": Node scales vertically with containing frame
   */
  readonly vertical: 'TOP' | 'BOTTOM' | 'CENTER' | 'TOP_BOTTOM' | 'SCALE';
  /**
   * Horizontal constraint as an enum
   * "LEFT": Node is laid out relative to left of the containing frame
   * "RIGHT": Node is laid out relative to right of the containing frame
   * "CENTER": Node is horizontally centered relative to containing frame
   * "LEFT_RIGHT": Both left and right of node are constrained relative to containing frame (node stretches with frame)
   * "SCALE": Node scales horizontally with containing frame
   */
  readonly horizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'LEFT_RIGHT' | 'SCALE';
}

/** Guides to align and place objects within a frame */
export interface LayoutGrid {
  /**
   * Orientation of the grid as a string enum
   * "COLUMNS": Vertical grid
   * "ROWS": Horizontal grid
   * "GRID": Square grid
   */
  readonly pattern: 'COLUMNS' | 'ROWS' | 'GRID';
  /** Width of column grid or height of row grid or square grid spacing */
  readonly sectionSize: number;
  /** Is the grid currently visible? */
  readonly visible: boolean;
  /** Color of the grid */
  readonly color: Color;
  /**
   * Positioning of grid as a string enum
   * "MIN": Grid starts at the left or top of the frame
   * "MAX": Grid starts at the right or bottom of the frame
   * "CENTER": Grid is center aligned
   */
  readonly alignment: 'MIN' | 'MAX' | 'CENTER';
  /** Spacing in between columns and rows */
  readonly gutterSize: number;
  /** Spacing before the first column or row */
  readonly offset: number;
  /** Number of columns or rows */
  readonly count: number;
}

/** A visual effect such as a shadow or blur */
export interface Effect {
  /** Type of effect as a string enum */
  readonly type:
    | 'INNER_SHADOW'
    | 'DROP_SHADOW'
    | 'LAYER_BLUR'
    | 'BACKGROUND_BLUR';
  /** Is the effect active? */
  readonly visible: boolean;
  /** Radius of the blur effect (applies to shadows as well) */
  readonly radius: number;

  // The following properties are for shadows only:
  readonly color?: Color;
  readonly blendMode?: BlendMode;
  readonly offset?: Vector;
}

/** A solid color, gradient, or image texture that can be applied as fills or strokes */
export interface Paint {
  /** Type of paint as a string enum */
  readonly type:
    | 'SOLID'
    | 'GRADIENT_LINEAR'
    | 'GRADIENT_RADIAL'
    | 'GRADIENT_ANGULAR'
    | 'GRADIENT_DIAMOND'
    | 'IMAGE'
    | 'EMOJI';
  /**
   * Is the paint enabled?
   * @default true
   */
  readonly visible: boolean;
  /**
   * Overall opacity of paint (colors within the paint can also have opacity
   * values which would blend with this)
   * @default 1
   */
  readonly opacity: number;
  // for solid paints
  /** Solid color of the paint */
  readonly color?: Color;
  // for gradient paints
  /**
   * This field contains three vectors, each of which are a position in
   * normalized object space (normalized object space is if the top left
   * corner of the bounding box of the object is (0, 0) and the bottom
   * right is (1,1)). The first position corresponds to the start of the
   * gradient (value 0 for the purposes of calculating gradient stops),
   * the second position is the end of the gradient (value 1), and the
   * third handle position determines the width of the gradient (only
   * relevant for non-linear gradients).
   *
   */
  readonly gradientHandlePositions?: ReadonlyArray<Vector>;
  /**
   * Positions of key points along the gradient axis with the colors
   * anchored there. Colors along the gradient are interpolated smoothly
   * between neighboring gradient stops.
   */
  readonly gradientStops?: ReadonlyArray<ColorStop>;
  // for image paints
  /** Image scaling mode */
  readonly scaleMode?: string;
}

/** A 2d vector */
export interface Vector {
  /** X coordinate of the vector */
  readonly x: number;
  /** Y coordinate of the vector */
  readonly y: number;
}

/** A position color pair representing a gradient stop */
export interface ColorStop {
  /** Value between 0 and 1 representing position along gradient axis */
  readonly position: number;
  /** Color attached to corresponding position */
  readonly color: Color;
}

/** Metadata for character formatting */
export interface TypeStyle {
  /** Font family of text (standard name) */
  readonly fontFamily: string;
  /** PostScript font name */
  readonly fontPostScriptName: string;
  /** Is text italicized? */
  readonly italic: boolean;
  /** Numeric font weight */
  readonly fontWeight: number;
  /** Font size in px */
  readonly fontSize: number;
  /** Horizontal text alignment as string enum */
  readonly textAlignHorizontal: 'LEFT' | 'RIGHT' | 'CENTER' | 'JUSTIFIED';
  /** Vertical text alignment as string enum */
  readonly textAlignVertical: 'TOP' | 'CENTER' | 'BOTTOM';
  /** Space between characters in px */
  readonly letterSpacing: number;
  /** Paints applied to characters */
  readonly fills: ReadonlyArray<Paint>;
  /** Line height in px */
  readonly lineHeightPx: number;
  /** Line height as a percentage of normal line height */
  readonly lineHeightPercent: number;
}

/**
 * A description of a master component. Helps you identify which component
 * instances are attached to
 */
export interface Component {
  /** The name of the component */
  readonly name: string;
  /** The description of the component as entered in the editor */
  readonly description: string;
}

// General API Types

/** A comment or reply left by a user */
export interface Comment {
  /** Unique identifier for comment */
  readonly id: string;
  /** The file in which the comment lives */
  readonly file_key: string;
  /** If present, the id of the comment to which this is the reply */
  readonly parent_id: string;
  /** The user who left the comment */
  readonly user: User;
  /** The time at which the comment was left */
  readonly created_at: Date;
  /** If set, when the comment was resolved */
  readonly resolved_at: Date | null;
  /**
   * (MISSING IN DOCS)
   * The content of the comment
   */
  readonly message: string;
  readonly client_meta: Vector;
  /**
   * Only set for top level comments. The number displayed with the
   * comment in the UI
   */
  readonly order_id: number;
}

/** A description of a user */
export interface User {
  readonly handle: string;
  readonly img_url: string;
}

export interface ProjectSummary {
  readonly id: string;
  readonly name: string;
}

export interface FileResponse {
  readonly components: {
    readonly [key: string]: Component;
  };
  readonly document: Document;
  readonly lastModified: string;
  readonly name: string;
  readonly schemaVersion: number;
  readonly thumbnailUrl: string;
}

export interface FileImageResponse {
  readonly err: string | null;
  readonly images: {
    readonly [key: string]: string;
  };
}

export interface CommentsResponse {
  readonly comments: ReadonlyArray<Comment>;
}

export interface FileSummary {
  readonly key: string;
  readonly name: string;
  readonly thumbnail_url: string;
  readonly last_modified: string;
}

export interface TeamProjectsResponse {
  readonly projects: ReadonlyArray<ProjectSummary>;
}

export interface ProjectFilesResponse {
  readonly files: ReadonlyArray<FileSummary>;
}

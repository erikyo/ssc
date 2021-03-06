import { dataStringify, getDefaults } from './utils/fn';
import classnames from 'classnames';

/**
 * I know this is not the save function but is a hook to change some data before
 * Add custom dataset to element before save.
 *
 * @param {Object} extraProps Block element.
 * @param {Object} blockType  Blocks object.
 * @param {Object} attributes Blocks attributes.
 *
 * @return {Object} extraProps Modified block element.
 */
export const addExtraProps = ( extraProps, blockType, attributes ) => {
	const {
		additionalCSS,
		sscAnimated,
		sscAnimationType,
		sscAnimationOptions,
		sscScene,
	} = attributes;

	if ( sscAnimated && sscAnimationType ) {
		const defaults = getDefaults( sscAnimationType );
		sscAnimationOptions[ sscAnimationType ] = {
			...defaults,
			...sscAnimationOptions[ sscAnimationType ],
		};

		extraProps[ 'data-ssc-animation' ] = sscAnimationType;

		const options = sscAnimationOptions[ sscAnimationType ] || false;
		if ( options && Object.keys( options ).length ) {
			extraProps[ 'data-ssc-props' ] = dataStringify(
				options,
				sscAnimationType
			);
		}

		if ( sscAnimationType === 'sscTimelineChild' ) {
			try {
				// const sceneData = JSON.parse( rawData ) || {};
				extraProps[ 'data-scene' ] = JSON.stringify(
					sscScene,
					null,
					null
				);
			} catch ( err ) {
				extraProps[ 'data-scene' ] = '';
			}
		}

		// map the original array into a single key value object
		if ( sscAnimationType === 'sscSequence' ) {
			const selected =
				sscAnimationOptions[ sscAnimationType ].scene || false;
			if (
				selected &&
				Object.keys( sscAnimationOptions[ sscAnimationType ] ).length
			) {
				extraProps[ 'data-ssc-sequence' ] = dataStringify(
					selected,
					'sequence'
				);
			}
		}

		// element classes
		const classes = sscAnimated ? 'ssc' : '';

		Object.assign( extraProps, {
			className: classnames( extraProps.className, classes ),
		} );
	}

	if ( additionalCSS ) {
		const hasMotion =
			sscAnimationOptions[ sscAnimationType ] &&
			sscAnimationOptions[ sscAnimationType ].motion
				? {
						transition:
							sscAnimationOptions[ sscAnimationType ].motion +
							'ms',
				  }
				: {};

		Object.assign( extraProps, {
			style: { ...hasMotion, ...additionalCSS, ...extraProps.style },
		} );
	}

	return extraProps;
};

import PropTypes from 'prop-types'
/**
 * Table Head key list   
 */

export const HeadStyle = {
    Product: 1,
    Flatform: 2,
    Game: 3,
    Developer: 4,
    Music: 5,
    User: 6,
}

function HeadKey() { }

HeadKey.prototype = {
    HeadStyle: PropTypes.oneOf(Object.keys(HeadStyle)),
}

export default HeadKey
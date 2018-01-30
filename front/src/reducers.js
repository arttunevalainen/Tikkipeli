

export default (state = {}, action) => {
    switch (action.type) {
        case 'NEWPLAYER':
            return  { playername: action.name, playercode: action.code, component: action.component }
        default:
            return state
    }
}
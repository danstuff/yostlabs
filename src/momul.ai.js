import Two from 'two.js';
import TWEEN from "tween.js";
import $ from "jquery";

let config = {};

function startup(_config)
{
    config = _config;
}

function getPiecePos(piece)
{
    let px = Math.floor(piece.position.x / config.tile_size);
    let py = Math.floor(piece.position.y / config.tile_size);
    return [ px, py ];
}

function getPiece(team, tx, ty)
{
    for (let i in team.pieces)
    {
        let piece = team.pieces[i];
        let pos = getPiecePos(piece)
        if (tx == pos[0] && ty == pos[1])
        {
            return piece;
        }
    }
    return null;
}

function forEachTile(callback)
{
    for (let x = 0; x <= config.tiles_per_row; x++)
    {
        for (let y = 0; y <= config.tiles_per_row; y++)
        {
            callback(x, y);
        }
    }
}

function isValidMove(team, tx, ty)
{
    let dx = tx - team.ltx;
    let dy = ty - team.lty;

    if (dx && dy)
    {
        /* Prevent moving diagonally */
        return false;
    }
    else if (tx == team.goal_x && ty == team.goal_y)
    {
        /* Prevent overlapping own goal */
        return false;
    }
    else
    {
        /* Do a simple raycast to check for intersecting pieces */
        let x_step = dx ? dx / Math.abs(dx) : 0;
        let y_step = dy ? dy / Math.abs(dy) : 0;

        let x = team.ltx;
        let y = team.lty;

        do
        {
            x += x_step;
            y += y_step;

            let mp = getPiece(team, x, y);
            let ep = getPiece(team.enemy, x, y);

            if (mp || (ep && (x != tx || y != ty)))
            {
                return false;
            }
        } while (x != tx || y != ty);

        return true;
    }
}

function isSafeMove(team, tx, ty)
{
    // TODO
}

function findBestMove(team)
{
    // TODO
    return { 
        tx0: 5, ty0: 0,
        tx1: 0, ty1: 0,
    };
}

export { startup, isValidMove, findBestMove, getPiece };

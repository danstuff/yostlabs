/* 
 * TODO:
 *  - animations/tweening
 *  - pieces remaining / pieces taken
 */

import Two from 'two.js';
import TWEEN from "tween.js";
import $ from "jquery";

const TILE_SIZE = 80;
const TILES_PER_ROW = 8;

const PIECE_SCALE = 0.75;
const SELECTOR_SCALE = 0.9;

const MULS_PER_TEAM = 8;

const ACTION_PUT = 1;
const ACTION_MOVE = 2;
const ACTION_REMOVE = 3;

var team_a;
var team_b;

var two;

function startup($root) {
    team_a = newTeam();
    team_b = newTeam();

    two = new Two({
        type: Two.Types.svg,
        fullscreen: false,
    }).appendTo($root[0]);

    putBoard()

    putPiece(team_a, 4, 0);
    putPiece(team_a, 5, 1);
    putPiece(team_a, 6, 2);
    putPiece(team_a, 7, 3);

    putPiece(team_b, 0, 4);
    putPiece(team_b, 1, 5);
    putPiece(team_b, 2, 6);
    putPiece(team_b, 3, 7);

    two.bind('update', () => {
        TWEEN.update();
    }).play();

    $root.click((e) => {
        let tx = Math.floor(e.pageX / TILE_SIZE);
        let ty = Math.floor(e.pageY / TILE_SIZE);

        if (!isInside(tx, ty))
        {
            return;
        }

        movePiece(two, team_a, tx, ty);
        movePiece(two, team_b, tx, ty);

        console.log(team_a, team_b);
    });
}

function newTeam()
{
    return {
        pieces : [],
        piece_selected : null,
        ltx : 0,
        lty : 0,
        muls_remaining : MULS_PER_TEAM,
    };
}

function putBoard()
{
    let lines = [];

    for (let x = 0; x <= TILES_PER_ROW; x++)
    {
        lines.push(new Two.Line(TILE_SIZE*x, 0, TILE_SIZE*x, TILE_SIZE*TILES_PER_ROW));
    }

    for (let y = 0; y <= TILES_PER_ROW; y++)
    {
        lines.push(new Two.Line(0, TILE_SIZE*y, TILE_SIZE*TILES_PER_ROW, TILE_SIZE*y));
    }

    let board = new Two.Group(lines);
    two.add(board);

    let goal_a = new Two.Circle((TILES_PER_ROW-0.5)*TILE_SIZE, TILE_SIZE/2, TILE_SIZE/2);
    two.add(goal_a);

    let goal_b = new Two.Star(TILE_SIZE/2, (TILES_PER_ROW-0.5)*TILE_SIZE, TILE_SIZE, TILE_SIZE, 3);
    two.add(goal_b);

    return board, goal_a, goal_b;
}

function putPiece(team, tx, ty)
{
    let piece = null;
    let px = tx*TILE_SIZE + TILE_SIZE/2;
    let py = ty*TILE_SIZE + TILE_SIZE/2;
    let r = PIECE_SCALE*TILE_SIZE/2;
    let target = null;

    if (team == team_a)
    {
        piece = new Two.Circle(px, py, 1);
        piece.fill = 'rgba(191, 0, 168, 0.33)';
        piece.stroke = 'rgb(191, 0, 168)';

        target = { radius: r };
    }
    else if (team == team_b)
    {
        piece = new Two.Star(px, py, 1, 1, 3);
        piece.fill = 'rgba(0, 191, 168, 0.33)';
        piece.stroke = 'rgb(0, 191, 168)';

        target = { innerRadius: r*2, outerRadius: r*2 };
    }

    const tween = new TWEEN.Tween(piece)
        .to(target, 250)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();

    piece.linewidth = 5;

    two.add(piece);
    team.pieces.push(piece);
}

function movePiece(two, team, tx, ty)
{
    let piece_clicked = getPiece(team, tx, ty);
    if (team.piece_selected && !piece_clicked && isValidMove(team, tx, ty))
    {
        setPiecePos(team.piece_selected, tx, ty);
        removeEnemyPiece(two, team, tx, ty);

        setPieceStrokeWidth(team.piece_selected, 5);
        team.piece_selected = null;
    }
    else if (team.piece_selected && team.piece_selected == piece_clicked)
    {
        let ttx = team == team_a ? tx - 1 : tx + 1;
        let tty = team == team_a ? ty + 1 : ty - 1;

        if (isInside(ttx, tty) && team.muls_remaining > 0 && !getPiece(team, ttx, tty))
        {
            team.muls_remaining--;
            putPiece(team, ttx, tty);
            removeEnemyPiece(two, team, ttx, tty);
        }

        setPieceStrokeWidth(team.piece_selected, 5);
        team.piece_selected = null;
    }
    else if (piece_clicked)
    {
        team.piece_selected = piece_clicked;
        setPieceStrokeWidth(team.piece_selected, 10);
        team.ltx = tx;
        team.lty = ty;
    }
}

function removeEnemyPiece(two, team, tx, ty)
{
    let enemy_team = team == team_a ? team_b : team_a;
    let enemy_piece = getPiece(enemy_team, tx, ty);

    if (enemy_piece)
    {
        two.remove(enemy_piece);
        enemy_team.pieces.splice(enemy_team.pieces.indexOf(enemy_piece), 1);
        enemy_team.piece_selected = null;
    }
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

function setPiecePos(piece, tx, ty)
{    
    let px = tx * TILE_SIZE + TILE_SIZE/2;
    let py = ty * TILE_SIZE + TILE_SIZE/2;

    let t = 200 + Math.sqrt(
        Math.pow(piece.position.x - px, 2) + 
        Math.pow(piece.position.y - py, 2));

    const tween = new TWEEN.Tween(piece.position)
        .to({x: px, y: py}, t)
        .easing(TWEEN.Easing.Exponential.Out)
        .start();
}

function getPiecePos(piece)
{
    let px = Math.floor(piece.position.x / TILE_SIZE);
    let py = Math.floor(piece.position.y / TILE_SIZE);

    return [ px, py ];
}

function isValidMove(team, tx, ty)
{
    let dx = tx - team.ltx;
    let dy = ty - team.lty;

    if (dx && dy)
    {
        return false;
    }
    else if ((tx == 0 && ty == TILES_PER_ROW-1) || 
        (tx == TILES_PER_ROW-1 && ty == 0))
    {
        return false;
    }
    else
    {
        let enemy_team = team == team_a ? team_b : team_a;

        let x_step = dx ? dx / Math.abs(dx) : 0;
        let y_step = dy ? dy / Math.abs(dy) : 0;

        let x = team.ltx;
        let y = team.lty;

        do
        {
            x += x_step;
            y += y_step;

            let mp = getPiece(team, x, y);
            let ep = getPiece(enemy_team, x, y);

            if (mp || (ep && (x != tx || y != ty)))
            {
                return false;
            }
        } while (x != tx || y != ty);

        return true;
    }
}

function isInside(tx, ty)
{
    return (tx < TILES_PER_ROW && ty < TILES_PER_ROW && tx >= 0 && ty >= 0);
}

function setPieceStrokeWidth(piece, sw)
{
    if (!piece)
    {
        return;
    }

    const tween = new TWEEN.Tween(piece)
        .to({ linewidth: sw }, 100)
        .easing(TWEEN.Easing.Cubic.Out)
        .start();
}

export { startup };

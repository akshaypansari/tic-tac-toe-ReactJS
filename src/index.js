import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

function Square(props)
{
  return (
    <button className={"square " + (props.isWinning?"square--winning" : null)}
     onClick = {props.onClick}>
      {props.value}
    </button>
  )
}
class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square 
        key={"square " + i}
        isWinning={this.props.winningSquares.includes(i)}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
        />
    );
  }
  render() {
    let rows = [];
    for(let i = 0; i<3; i++)
    {
      let col = []
      for(let j = 0; j<3; j++)
      {
        col.push(this.renderSquare(3*i+j));
      }
      rows.push(<div key={i} className="board-row"> {col} </div>);
    }
    return (
      <div>
        {rows}
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props)
  {
    super(props)
    this.state = 
    {
      history: [{
        squares: Array(9).fill(null),
        row: null,
        col: null,
      }],
      xIsNext: true,
      stepNumber: 0,
      reverse: false,
    };
  }
  handleClick(i)
  {
    const history = this.state.history.slice(0, this.state.stepNumber+1);
    const current = history[history.length-1];
    const squares = current.squares.slice();
    if (calculateWinner(squares)||squares[i]){
      return; 
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        row: ~~(i/3),
        col: i%3,
      }]),
      xIsNext : !this.state.xIsNext,
      stepNumber: history.length,
      reverse: false,
    });
  }
  jumpTo(step)
  {
    this.setState(
      {
        stepNumber : step,
        xIsNext: ( step%2) === 0,
      });
  }
  reverseHistory()
  {
    this.setState({
      reverse: !this.state.reverse,
    }
      );
  }
  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);
    const moves = history.map((step, mover) => {
      // const moves = history.map((step, move) => {
      // let mover = (history.length)-move-1;
      const desc = mover ? 
        'Go to move #' + mover + " (" +step.col+ "," +step.row+" )" : 
        'Go to Game Start';
        return (
          <li key={mover}>
            <button  
            style={ this.state.stepNumber===mover ? { fontWeight: 'bold' } : { fontWeight: 'normal' } }
            onClick={() => this.jumpTo(mover)}> {desc} </button>
          </li>
        );
    });
    let status;
    if (winner){
      status = "Winner " + winner.player;
    }
    else if(this.state.stepNumber===9){
      status = "The game is a draw";
    }
    else{
      status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
    }
    return (
      <div className="game">
        <div className="game-board">
          <Board 
            winningSquares = {winner? winner.line : []}
            squares = {current.squares}
            onClick = {(i) => this.handleClick(i)}
          />
        </div>
        <div className="game-info">
          <div>{status}</div>
          <ol>{this.state.reverse?moves.reverse(): moves}</ol>
          <button onClick={() => this.reverseHistory()}>
            sort by : {this.state.reverse? "Descending" : "Ascending"}
          </button>
        </div>
      </div>
    );
  }
}
function calculateWinner(squares) {
  const lines = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      // highlight the squares
      return {player: squares[a], line: [a,b,c]};
    }
  }
  return null;
}
// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
import React from 'react';
import classes from './Rooms.css';

class Rooms extends React.Component {

   static initialState = {
        newRoomName : '',
        showInputField : false
    }

    constructor (props) {
        super(props);
        this.state = {...Rooms.initialState};
        this.onChangeInput = this.onChangeInput.bind(this);
        this.onAddClick = this.onAddClick.bind(this);
        this.onBlur = this.onBlur.bind(this);
    }

    onChangeInput =  (e) => {
        this.setState({newRoomName : e.target.value});
    }

    onAddClick = () => {
        this.setState({showInputField: true},() => {
            this.inputRef.focus();
        })
    }

    onKeyUp = (e) => {
        if (e.key === 'Enter') {
            if(this.state.newRoomName.length){
                this.props.onAddNewRoom(this.state.newRoomName);
                this.setState(Rooms.initialState);
            }else{
                alert('Please enter a message');
            }
        }
    }

    onBlur = (e) => {
        this.setState(Rooms.initialState);
    }

    render () {        
        
       return (
            <div style={{height: '150px'}} className="col-md-4">
                    <h3>Rooms</h3>
                {this.state.showInputField ? 
                        <input className='form-control'  ref={(ref) => this.inputRef = ref} type="text"
                                 placeholder="Enter room name" value={this.state.newRoomName} 
                                 onChange={this.onChangeInput} onKeyUp={this.onKeyUp} onBlur={this.onBlur} /> : 

                                 <a href="#" onClick={this.onAddClick} className="btn btn-info btn-sm">
                                 <span className="glyphicon glyphicon-plus-sign"></span> Create Room
                               </a>}
                <div>
                    {this.props.rooms.length ? this.props.rooms.map((room, i) => {
                    return (
                        <div className={classes.Room} onClick={() => this.props.onClickRoom(room)} key={i}>
                           <p> {room} </p>
                        </div> 
                    )
                    }) : 'No Rooms Available'}
                </div>

            </div>
        )
    }
}

export default Rooms;
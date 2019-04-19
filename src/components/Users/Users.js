import React from 'react';
import classes from './Users.css';

const Users = (props) => {

        return (
            <div className="col-md-4">
                    <h3>{localStorage.getItem('username')}</h3>
                <div >
                    <h4>
                        Users Online
                    </h4>
                    {props.users.length > 1 ? props.users.map((user, i) => {
                    return (
                       user.uid !== localStorage.getItem('uid') ?
                        <div className={classes.User} onClick={() => props.onClickUser(user.uid)} key={i}>
                           <p> {user.name} </p>
                        </div> : null
                    )
                    }) : 'No Users Online'}
                </div>

            </div>
        )
}

export default Users;
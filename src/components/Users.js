import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { makeStyles } from '@material-ui/core/styles';
import { Table, TableContainer, TableHead, TableCell, TableBody, TableRow, Modal, Button, TextField, Avatar, TablePagination } from '@material-ui/core';
import { Edit, Delete, Add } from '@material-ui/icons';



const baseUrl = 'https://reqres.in/api/users/'

const useStyles = makeStyles((theme) => ({
    modal: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)'
    },
    iconos: {
        cursor: 'pointer'
    },
    inputMaterial: {
        width: '100%'
    },
    button: {
        backgroundColor: "#4caf50",
        color: "#c8e6c9",
        color: "black",
        borderRadius: "100%",
        cursor: "pointer",
    },
    pagination: {
        '& > * + *': {
            marginTop: theme.spacing(2),
        },
    }
}));

function Users() {
    const styles = useStyles();
    const [users, setUsers] = useState([]);
    const [modalInsert, setModalInsert] = useState(false);
    const [modalEdit, setModalEdit] = useState(false);
    const [modalDelete, setModalDelete] = useState(false);
    const [pagination, setPagination] = useState();
    const [page, setPage] = useState(2);
    const [rowsPerPage, setRowsPerPage] = useState(10);

    const [usrSelect, setUsrSelect] = useState({
        first_name: '',
        last_name: '',
        email: ''
    })

    const handleChange = e => {
        const { name, value } = e.target;
        setUsrSelect(prevState => ({
            ...prevState,
            [name]: value
        }))
    }

    const getUsers = async () => {
        await axios.get(baseUrl)
            .then(response => {
                console.log(response.data)
                setPagination(response.data)
                setUsers(response.data.data);
            })
    }

    
    const handleChangePage = (event, newPage) => {
        setPage(newPage);
      };
    
      const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(parseInt(event.target.value, 10));
        setPage(0);
      };
      
    const postUser = async () => {
        await axios.post(baseUrl, usrSelect)
            .then(response => {
                setUsers(users.concat(response.data))
                handleModalInsert()
            })
    }

    const updateUser = async () => {
        await axios.put(baseUrl + usrSelect.id, usrSelect)
            .then(response => {
                var newUser = users;
                newUser.map(usr => {
                    if (usrSelect.id === usr.id) {
                        usr.first_name = usrSelect.first_name;
                        usr.last_name = usrSelect.last_name;
                        usr.email = usrSelect.email;
                    }
                })
                setUsers(newUser);
                handleModalEdit();
            })
    }

    const deleteUser = async () => {
        await axios.delete(baseUrl + usrSelect.id)
            .then(response => {
                setUsers(users.filter(us => us.id !== usrSelect.id));
                handleModalDelete();
            })
    }

    const handleModalInsert = () => {
        setModalInsert(!modalInsert);
    }

    const handleModalEdit = () => {
        setModalEdit(!modalEdit);
    }

    const handleModalDelete = () => {
        setModalDelete(!modalDelete);
    }

    const selectUser = (consola, caso) => {
        setUsrSelect(consola);
        (caso === 'Edit') ? handleModalEdit() : handleModalDelete()
    }

    useEffect(() => {
        getUsers();
    }, [])

    const bodyInsert = (
        <div className={styles.modal}>
            <h3>Add New User</h3>
            <TextField name="first_name" className={styles.inputMaterial} label="First Name" onChange={handleChange} />
            <br />
            <TextField name="last_name" className={styles.inputMaterial} label="Last Name" onChange={handleChange} />
            <br />
            <TextField name="email" className={styles.inputMaterial} label="Email" onChange={handleChange} />
            <br />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => postUser()}>Insert</Button>
                <Button onClick={() => handleModalInsert()}>Cancel</Button>
            </div>
        </div>
    )

    const bodyEdit = (
        <div className={styles.modal}>
            <h3>Edit User</h3>
            <TextField name="first_name" className={styles.inputMaterial} label="First Name" onChange={handleChange} value={usrSelect && usrSelect.first_name} />
            <br />
            <TextField name="last_name" className={styles.inputMaterial} label="Last Name" onChange={handleChange} value={usrSelect && usrSelect.last_name} />
            <br />
            <TextField name="email" className={styles.inputMaterial} label="Email" onChange={handleChange} value={usrSelect && usrSelect.email} />
            <br />
            <br /><br />
            <div align="right">
                <Button color="primary" onClick={() => updateUser()}>Edit</Button>
                <Button onClick={() => handleModalEdit()}>Cancel</Button>
            </div>
        </div>
    )

    const bodyDelete = (
        <div className={styles.modal}>
            <p>Are you sure you want to delete <b>{usrSelect.first_name + ' ' + usrSelect.last_name}</b> ? </p>
            <div align="right">
                <Button color="secondary" onClick={() => deleteUser()} >Accept</Button>
                <Button onClick={() => handleModalDelete()}>Cancel</Button>

            </div>

        </div>
    )


    return (
        <div className="App" style={{ marginLeft: 50, marginRight: 50, marginTop: 20 }}>
            <div style={{ textAlign: "right" }}>
                <Button variant="contained" color="success" className={styles.button} onClick={() => handleModalInsert()}><Add></Add></Button>
            </div>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Avatar</TableCell>
                            <TableCell>Name</TableCell>
                            <TableCell>Email</TableCell>
                            <TableCell>Actions</TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {users.map(user => (
                            <TableRow key={user.id}>
                                <TableCell><Avatar style={{ width: 80, height: 80 }} src={user.avatar} /></TableCell>
                                <TableCell>{user.first_name} {user.last_name}</TableCell>
                                <TableCell>{user.email}</TableCell>
                                <TableCell>
                                    <Edit className={styles.iconos} onClick={() => selectUser(user, 'Edit')} />
                                    &nbsp;&nbsp;&nbsp;
                                    <Delete className={styles.iconos} onClick={() => selectUser(user, 'Delete')} />
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>
            <TablePagination
                component="div"
                count={100}
                page={page}
                onPageChange={handleChangePage}
                rowsPerPage={rowsPerPage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            />
            <Modal
                open={modalInsert}
                onClose={handleModalInsert}>
                {bodyInsert}
            </Modal>

            <Modal
                open={modalEdit}
                onClose={handleModalEdit}>
                {bodyEdit}
            </Modal>

            <Modal
                open={modalDelete}
                onClose={handleModalDelete}>
                {bodyDelete}
            </Modal>
        </div>
    );
}

export default Users;

import { Icon } from '@iconify/react';
import { sentenceCase } from 'change-case';
import { useState, useEffect } from 'react';
import plusFill from '@iconify/icons-eva/plus-fill';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import {
  Card,
  Table,
  Stack,
  TableRow,
  TableBody,
  TableCell,
  Container,
  Typography,
  TableContainer,
  TablePagination,
  Snackbar,
  Alert
} from '@mui/material';
// components
import axios from 'axios';
import { getToken } from '../../../../utils/tokenUtils';
import Scrollbar from '../../../Scrollbar';
import SearchNotFound from '../../../SearchNotFound';
import { UserListHead, UserListToolbar, UserMoreMenu } from '../../user';
//
import USERLIST from '../../../../_mocks_/user';
import Page from '../../../Page';
import Label from '../../../Label';
import ConfirmationDialog from './ConfirmationDialog';
import EditUserDialog from './EditUserDialog';

const TABLE_HEAD = [
  { id: 'first_name', label: 'First Name', alignRight: false },
  { id: 'last_name', label: 'Last Name', alignRight: false },
  { id: 'email', label: 'Email', alignRight: false },
  { id: '' }
];

export default function UsersTable() {
  const [page, setPage] = useState(0);
  const [order, setOrder] = useState('asc');
  const [selected, setSelected] = useState([]);
  const [orderBy, setOrderBy] = useState('name');
  const [filterName, setFilterName] = useState('');
  const [rowsPerPage, setRowsPerPage] = useState(25);
  const [users, setUsers] = useState([]);
  const [totalUsers, setTotalUsers] = useState();
  const [totalPages, setTotalPages] = useState();
  const [isError, setIsError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('Unexpected Error. Please check your network');
  const [pendingDeleteUser, setPendingDeleteUser] = useState();
  const [isConfirmationDialogOpen, setIsConfirmationDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [editedUser, setEditedUser] = useState();
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const listUsersResponse = await axios({
        method: 'get',
        url: `${process.env.REACT_APP_BASE_BACKEND_URL}/users?page=${page}`,
        headers: { Authorization: `Bearer ${getToken('access-token')}` }
      });
      const { users, numberOfPages, totalUsers } = listUsersResponse.data;
      setUsers(users);
      setTotalPages(numberOfPages);
      setTotalUsers(totalUsers);
    } catch (error) {
      return navigate('/login', { replace: true });
    }
  };

  const deleteUser = async () => {
    try {
      const deletedUser = await axios({
        method: 'delete',
        url: `${process.env.REACT_APP_BASE_BACKEND_URL}/users/${pendingDeleteUser}`,
        headers: { Authorization: `Bearer ${getToken('access-token')}` }
      });
      setIsConfirmationDialogOpen(false);
      setUsers([...users.filter((user) => user.id !== pendingDeleteUser)]);
    } catch (error) {
      return navigate('/login', { replace: true });
    }
  };

  const handleEditUser = async (newUser) => {
    try {
      const editedUser = await axios({
        method: 'put',
        url: `${process.env.REACT_APP_BASE_BACKEND_URL}/users/update/${newUser.id}`,
        data: {
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          email: newUser.email
        },
        headers: { Authorization: `Bearer ${getToken('access-token')}` }
      });
      setIsEditDialogOpen(false);
      fetchUsers();
    } catch (error) {
      return navigate('/login', { replace: true });
    }
  };

  const setDeletedUser = async (id) => {
    setPendingDeleteUser(id);
    setIsConfirmationDialogOpen(true);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleAlertClose = () => {
    setIsError(false);
  };

  const handleDialogClose = () => {
    setIsConfirmationDialogOpen(false);
  };

  const handleEditDialogClose = () => {
    setIsEditDialogOpen(false);
  };

  const handleEditDialogOpen = (user) => {
    setEditedUser(user);
    setIsEditDialogOpen(true);
  };

  const emptyRows = page > 0 ? Math.max(0, (1 + page) * rowsPerPage - USERLIST.length) : 0;

  const filteredUsers = USERLIST;

  const isUserNotFound = filteredUsers.length === 0;

  return (
    <Page title="User | Minimal-UI">
      <Container>
        <Stack direction="row" alignItems="center" justifyContent="space-between" mb={5}>
          <Typography variant="h4" gutterBottom>
            Users
          </Typography>
        </Stack>

        <Card>
          <Scrollbar>
            <TableContainer sx={{ minWidth: 800 }}>
              <Table>
                <UserListHead
                  order={order}
                  orderBy={orderBy}
                  headLabel={TABLE_HEAD}
                  rowCount={USERLIST.length}
                  numSelected={selected.length}
                />
                <TableBody>
                  {users.map((row) => {
                    const { id, email } = row;
                    const firstName = row.first_name;
                    const lastName = row.last_name;

                    return (
                      <TableRow hover key={id} tabIndex={-1} role="checkbox">
                        <TableCell component="th" scope="row" padding="2px">
                          <Stack direction="row" alignItems="center" spacing={2}>
                            <Typography variant="subtitle2" noWrap>
                              {firstName}
                            </Typography>
                          </Stack>
                        </TableCell>
                        <TableCell align="left">{lastName}</TableCell>
                        <TableCell align="left">{email}</TableCell>

                        <TableCell align="right">
                          <UserMoreMenu
                            id={id}
                            user={row}
                            onDelete={setDeletedUser}
                            onEdit={handleEditDialogOpen}
                          />
                        </TableCell>
                      </TableRow>
                    );
                  })}
                  {emptyRows > 0 && (
                    <TableRow style={{ height: 53 * emptyRows }}>
                      <TableCell colSpan={6} />
                    </TableRow>
                  )}
                </TableBody>
                {isUserNotFound && (
                  <TableBody>
                    <TableRow>
                      <TableCell align="center" colSpan={6} sx={{ py: 3 }}>
                        <SearchNotFound searchQuery={filterName} />
                      </TableCell>
                    </TableRow>
                  </TableBody>
                )}
              </Table>
            </TableContainer>
          </Scrollbar>

          <TablePagination
            rowsPerPageOptions={[25]}
            component="div"
            count={totalUsers}
            rowsPerPage={25}
            page={page}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Card>
        {isConfirmationDialogOpen ? (
          <ConfirmationDialog handleClose={handleDialogClose} handleConfirm={deleteUser} />
        ) : null}
        {isEditDialogOpen ? (
          <EditUserDialog
            handleClose={handleEditDialogClose}
            user={editedUser}
            handleConfirm={handleEditUser}
          />
        ) : null}
        <Snackbar
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
          open={isError}
          autoHideDuration={3000}
          onClose={handleAlertClose}
        >
          <Alert onClose={handleAlertClose} severity="error" variant="filled">
            {errorMessage}
          </Alert>
        </Snackbar>
      </Container>
    </Page>
  );
}

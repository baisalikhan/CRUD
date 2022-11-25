import {
  StyleSheet,
  Text,
  TextInput,
  View,
  Button,
  FlatList,
  TouchableOpacity,
  Alert,
} from 'react-native';
import React, {useEffect, useState} from 'react';
import {openDatabase} from 'react-native-sqlite-storage';

const db = openDatabase({name: 'Communication'});

export default function App() {
  useEffect(() => {
    createTable();
    fetchUsers();
  }, []);

  const createTable = () => {
    db.transaction(txn => {
      txn.executeSql(
        `Create table if not exists CWSP (id integer primary key autoincrement, name varchar(50), specialCase varchar(50), signlangStand varchar(50))`,
        [],
        (sqltxn, res) => {
          console.log('Table created Successfully');
        },
        error => {
          console.log('Error Occured during Table Creation');
        },
      );
    });
  };

  function AddUser() {
    db.transaction(txn => {
      txn.executeSql(
        `insert into CWSP (name, specialCase, signlangStand) values(?,?,?)`,
        [name, specialCase, signLangStand],
        (sqltxn, res) => {
          console.log('Inserted  Successfully');
          setName('');
          setSpecialCase('');
          setSignLangStand('');
          fetchUsers();
        },
        error => {
          console.log('Error Occured during Inserting');
        },
      );
    });
  }

  const [usersList, setUsersList] = useState([]);
  const [name, setName] = useState();
  const [specialCase, setSpecialCase] = useState();
  const [signLangStand, setSignLangStand] = useState();

  const [id, setId] = useState();
  const [btnTitle, setBtnTitle] = useState('AddUser');

  function fetchUsers() {
    db.transaction(txn => {
      txn.executeSql(
        `select * from CWSP`,
        [],
        (sqltxn, res) => {
          console.log('Fetch Successfully');
          let recordSet = [];
          for (let i = 0; i < res.rows.length; i++) {
            let record = res.rows.item(i);
            recordSet.push({
              id: record.id,
              name: record.name,
              specialCase: record.specialCase,
              signlangStand: record.signlangStand,
            });
            console.log(
              record.id,
              record.name,
              record.specialCase,
              record.signlangStand,
            );
          }
          setUsersList(recordSet);
        },
        error => {
          console.log('Error Occured during fetch.');
        },
      );
    });
  }

  function deleteUser(idforDelete) {
    db.transaction(txn => {
      txn.executeSql(
        `Delete from CWSP where id=?`,
        [idforDelete],
        (sqltxn, res) => {
          Alert.alert('Success', ' Deleted Successfully...');
          fetchUsers();
        },
        error => {
          Alert.alert('Error', ' Error Occured...');
        },
      );
    });
  }

  function editUser(item) {
    setId(item.id);
    setName(item.name);
    setSpecialCase(item.specialCase);
    setSignLangStand(item.signlangStand);
    console.log('btn title change to Update: ' + id + ' ' + signLangStand);
    setBtnTitle('update');
  }

  function update() {
    db.transaction(txn => {
      txn.executeSql(
        `UPDATE CWSP set name=?, specialCase=?, signlangStand=?  where id=?`,
        [name, specialCase, signLangStand, id],
        (sqltxn, res) => {
          Alert.alert('Update: ', 'record update successfully..');
          setId();
          setName('');
          setSpecialCase('');
          setSignLangStand('');
          setBtnTitle('AddUser');
          fetchUsers();
        },
        error => {
          Alert.alert('Error', 'error occurred in Update');
        },
      );
    });
  }

  function btnCheck() {
    if (btnTitle === 'AddUser') {
      AddUser();
    } else if (btnTitle === 'update') {
      update();
    }
  }

  return (
    <View style={myStyles.body}>
      <View style={myStyles.mainContainer}>
        <View style={myStyles.titleContainer}>
          <Text style={myStyles.title}>
            Communication With Special People(Deef & Dumb)
          </Text>
        </View>
        <View style={myStyles.inputContainer}>
          <TextInput
            style={myStyles.input}
            value={name}
            placeholder={'Enter Name'}
            onChangeText={Value => setName(Value)}
          />
          <TextInput
            style={myStyles.input}
            value={specialCase}
            placeholder={'Enter Special Case'}
            onChangeText={Value => setSpecialCase(Value)}
          />
          <TextInput
            style={myStyles.input}
            value={signLangStand}
            placeholder={'Enter Sign Language Standard'}
            onChangeText={Value => setSignLangStand(Value)}
          />
        </View>
        <View style={myStyles.btnContainer}>
          <Button title={btnTitle} onPress={btnCheck} />
        </View>
        {/* <TouchableOpacity onPress={AddUser} style={myStyles.btnStyle}>
          <Text>Add User</Text>
        </TouchableOpacity> */}
        <FlatList
          keyExtractor={(value, index) => index.toString()}
          data={usersList}
          renderItem={({item}) => (
            <View style={myStyles.fetchUserStyle}>
              {/* <TouchableOpacity onPress={() => deleteUser(item.id)}> */}
              <TouchableOpacity
                style={myStyles.showText}
                onPress={() => deleteUser(item.id)}>
                <Text style={myStyles.textStyle}>
                  {item.id} {item.name} {item.specialCase} {item.signlangStand}
                </Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => editUser(item)}>
                <Text style={myStyles.btnEdit}>Edit</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    </View>
  );
}

const myStyles = StyleSheet.create({
  body: {
    flex: 1,
    backgroundColor: '#ffccdd',
    margin: 10,
  },
  mainContainer: {
    flex: 1,
  },
  titleContainer: {
    height: 80,
  },
  title: {
    textAlign: 'center',
    fontSize: 22,
    marginTop: 5,
    fontWeight: 'bold',
  },
  input: {
    widht: 100,
    height: 50,
    backgroundColor: 'yellow',
    color: 'black',
    marginBottom: 5,
    borderRadius: 15,
    padding: 15,
  },
  btnContainer: {
    backgroundColor: 'blue',
    textAlign: 'center',
    color: '#fff',
    margin: 10,
    width: 200,
    alignSelf: 'center',
  },
  fetchUserStyle: {
    width: 400,
    backgroundColor: 'beige',
  },
  showText: {
    flexDirection: 'row',
    margin: 15,
  },
  textStyle: {
    color: 'green',
    fontWeight: 'bold',
  },
  btnEdit: {
    width: 40,
    margin: 5,
    marginLeft: 15,
    padding: 5,
    fontWeight: 'bold',
    backgroundColor: 'blue',
    textAlign: 'center',
    borderRadius: 10,
    color: '#fff',
  },
});

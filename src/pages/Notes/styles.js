import {StyleSheet} from 'react-native';

export default StyleSheet.create({
  bodyContainer: {
    display: 'flex',
    padding: 10,
    height: '100%',
    flexDirection: 'column',
    justifyContent: 'space-around',
    backgroundColor: '#00c6f9',
  },
  title: {
    fontSize: 24,
    color: '#14375d',
    fontWeight: '600',
  },
  selectContainer: {
    alignItems: 'center',
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between'
  },
  select: {
    height: 30,
    width: 150,
    borderColor: '#14375d',
    borderWidth: 1,
    borderRadius: 5,
  },
  noteContainer: {
    padding: 10,
    fontSize: 18,
    fontWeight: '400',
  },
  input: {
    borderWidth: 1,
    borderRadius: 4,
    paddingHorizontal: 15,
    backgroundColor: 'white'
  },
  buttonContainer: {
    padding: 10,
    fontSize: 18,
    fontWeight: '400',
  },
});
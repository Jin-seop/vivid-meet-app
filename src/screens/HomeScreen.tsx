import { useQuery } from '@tanstack/react-query';
// import client from '../api/client';
import React from 'react';
import { Text, FlatList } from 'react-native';

const HomeScreen = () => {
  // const { data, isLoading, error } = useQuery({
  //   queryKey: ['recommendedUsers'],
  //   queryFn: async () => {
  //     const res = await client.get('/user/recommend');
  //     return res.data;
  //   },
  // });
  // if (isLoading) return <Text>로딩 중...</Text>;
  // if (error) return <Text>에러 발생!</Text>;
  // return (
  //   <FlatList data={data} renderItem={({ item }) => <UserCard user={item} />} />
  // );
};

export default HomeScreen;

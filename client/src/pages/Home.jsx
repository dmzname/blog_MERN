import React, { useEffect } from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Grid from '@mui/material/Grid';

import { Post, TagsBlock, CommentsBlock } from '../components';

import { useDispatch, useSelector } from 'react-redux';
import { fetchPosts, fetchTags } from '../redux/slices/posts';

export const Home = () => {
	const dispatch = useDispatch();
	const { posts, tags } = useSelector((state) => state.posts);
	const activeTab = posts.sorted === 'views' ? 1 : 0;
	const userData = useSelector((state) => state.auth.data);

	const isPostsLoading = posts.status === 'loading';
	const isTagsLoading = tags.status === 'loading';

	useEffect(() => {
		dispatch(fetchPosts(posts.sorted || ''));
		dispatch(fetchTags());
	}, []);

	const sortedPosts = (e) => {
		const { sort } = e.target.dataset;
		dispatch(fetchPosts(sort));
	};

	return (
		<>
			<Tabs style={{ marginBottom: 15 }} value={activeTab} aria-label="basic tabs example">
				<Tab onClick={sortedPosts} label="Новые" data-sort="new" />
				<Tab onClick={sortedPosts} label="Популярные" data-sort="views" />
			</Tabs>
			<Grid container spacing={4}>
				<Grid xs={8} item>
					{(isPostsLoading ? [...Array(5)] : posts.items).map((obj, index) =>
						isPostsLoading ? (
							<Post key={index} isLoading={true} />
						) : (
							<Post
								key={`post${index}`}
								_id={obj._id}
								title={obj.title}
								imageUrl={obj.imageUrl ? `http://localhost:4444${obj.imageUrl}` : null}
								user={obj.user}
								createdAt={obj.createdAt}
								viewsCount={obj.viewsCount}
								commentsCount={3}
								tags={obj.tags}
								isEditable={userData?._id === obj.user._id}
							/>
						)
					)}
				</Grid>
				<Grid xs={4} item>
					<TagsBlock items={tags.items} isLoading={isTagsLoading} />
					<CommentsBlock
						items={[
							{
								user: {
									fullName: 'Вася Пупкин',
									avatarUrl: 'https://mui.com/static/images/avatar/1.jpg'
								},
								text: 'Это тестовый комментарий'
							},
							{
								user: {
									fullName: 'Иван Иванов',
									avatarUrl: 'https://mui.com/static/images/avatar/2.jpg'
								},
								text: 'When displaying three lines or more, the avatar is not aligned at the top. You should set the prop to align the avatar at the top'
							}
						]}
						isLoading={false}
					/>
				</Grid>
			</Grid>
		</>
	);
};

import { supabase } from '../lib/supabase'

const postSelect = 'id,title,body,category,status,locked,created_at,author_id,profiles(full_name)'
const replySelect = 'id,body,status,created_at,author_id,profiles(full_name)'

export function fetchForumPosts(userId) {
  return supabase
    .from('forum_posts')
    .select(postSelect)
    .or(`status.eq.approved,author_id.eq.${userId}`)
    .order('created_at', { ascending: false })
}

export function fetchForumReplies(postId, userId) {
  return supabase
    .from('forum_replies')
    .select(replySelect)
    .eq('post_id', postId)
    .or(`status.eq.approved,author_id.eq.${userId}`)
    .order('created_at')
}

export function createForumPost({ authorId, body, category, title }) {
  return supabase.from('forum_posts').insert({
    author_id: authorId,
    body,
    category,
    title,
  })
}

export function createForumReply({ authorId, body, postId }) {
  return supabase.from('forum_replies').insert({
    author_id: authorId,
    body,
    post_id: postId,
  })
}

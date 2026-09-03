import { supabase } from '../lib/supabase'

export function fetchAdminCollection(table) {
  return supabase.from(table).select('*').order('created_at', { ascending: false })
}

export function createAdminEntry(table, payload) {
  return supabase.from(table).insert(payload)
}

export function updateAdminEntry(table, id, payload) {
  return supabase.from(table).update(payload).eq('id', id)
}

export function deleteAdminEntry(table, id) {
  return supabase.from(table).delete().eq('id', id)
}

export function fetchPendingForumPosts() {
  return supabase
    .from('forum_posts')
    .select('id,title,body,category,status,created_at,profiles(full_name)')
    .eq('status', 'pending')
    .order('created_at')
}

export function fetchPendingForumReplies() {
  return supabase
    .from('forum_replies')
    .select('id,body,status,created_at,profiles(full_name),forum_posts(title)')
    .eq('status', 'pending')
    .order('created_at')
}

export function updateForumPostStatus(id, status) {
  return supabase.from('forum_posts').update({ status }).eq('id', id)
}

export function updateForumReplyStatus(id, status) {
  return supabase.from('forum_replies').update({ status }).eq('id', id)
}

export function deleteForumPost(id) {
  return supabase.from('forum_posts').delete().eq('id', id)
}

export function deleteForumReply(id) {
  return supabase.from('forum_replies').delete().eq('id', id)
}

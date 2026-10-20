// Never mistake an authentication/preview HTML page for a tutor reply.
export async function readTutorResponse(response: Response) {
  const fail = (message: string): never => {
    const error = new Error(message);
    error.name = 'TutorResponseError';
    throw error;
  };
  if (response.status === 429) fail('The tutor has reached its current usage limit. Please try later; your message is saved.');
  if (response.status === 401 || response.status === 403) fail('The tutor session could not be authorized. Reopen the app and try again; your message is saved in this tab.');
  if (response.redirected || !response.headers.get('content-type')?.includes('application/json')) {
    fail('The app did not reach the tutor service. Reopen the app from AI Studio and try again. Your message is saved in this tab.');
  }
  if (!response.ok) fail('The tutor service is temporarily unavailable. Your message is saved. Please try again later.');
  let data;
  try { data = await response.json(); }
  catch { fail('The tutor returned an incomplete reply. Your message is saved. Please retry.'); }
  if (!data || typeof data.replyEnglish !== 'string' || !data.replyEnglish.trim()
    || typeof data.hasErrors !== 'boolean' || typeof data.feedbackSummary !== 'string'
    || !Array.isArray(data.detectedTenses) || data.detectedTenses.some((x: unknown) => typeof x !== 'string')
    || !Array.isArray(data.suggestedReplies) || data.suggestedReplies.some((x: unknown) => typeof x !== 'string')) {
    fail('The tutor returned an incomplete reply. Your message is saved. Please retry.');
  }
  return data;
}

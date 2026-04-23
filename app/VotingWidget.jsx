async function load() {
  setLoading(true);

  console.log("VotingWidget: fetching for date:", voteDate);

  const { data: optData, error: optError } = await supabase
    .from("vote_options")
    .select("options")
    .eq("vote_date", voteDate)
    .single();

  console.log("vote_options result:", optData, "error:", optError);

  if (optData?.options) setOptions(optData.options);

  const { data: voteData, error: voteError } = await supabase
    .from("daily_votes")
    .select("option_text, vote_count")
    .eq("vote_date", voteDate);

  console.log("daily_votes result:", voteData, "error:", voteError);

  if (voteData) {
    const map = {};
    let total = 0;
    voteData.forEach(v => { map[v.option_text] = v.vote_count; total += v.vote_count; });
    setVotes(map);
    setTotalVotes(total);
  }

  setLoading(false);
}

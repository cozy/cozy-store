curl -X "POST" "http://localhost:8081/registry" \
     -H "Authorization: Token AAAAAAAAAAAAAAAAAAAAABhj41vJRbiDfj/GVe8pRwa5YyptH/doBaj+5e5F8AlNMhDDBGBblLzw0CdDj6CBCddCD9AKxSuRe6jwawftooU=" \
     -H "Content-Type: application/json" \
     -d $'{
  "slug": "collect",
  "type": "webapp",
  "editor": "Cozy"
}'

# {{EDITOR_TOKEN}} -> your generated editor access token
curl -X "POST" "http://localhost:8081/registry/collect" \
     -H "Authorization: Token AAAAAAAAAAAAAAAAAAAAABhj41vJRbiDfj/GVe8pRwa5YyptH/doBaj+5e5F8AlNMhDDBGBblLzw0CdDj6CBCddCD9AKxSuRe6jwawftooU=" \
     -H "Content-Type: application/json" \
     -d $'{
  "url": "https://github.com/konnectors/cozy-konnector-bouyguesbox/archive/bd0361cd69bfa869348f3e3e3a9509221a84f14a.tar.gz",
  "sha256": "bd0361cd69bfa869348f3e3e3a9509221a84f14a",
  "version": "0.0.1",
  "type": "webapp",
  "editor": "Cozy"
}'

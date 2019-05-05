require 'webrick'
require 'json'
require 'linguist'

Handler = Proc.new do |req, res|
    obj = JSON.parse(req.body)

    blob = Linguist::Blob.new(obj['path'], obj['content'])
    type = if blob.text?
        'Text'
    elsif blob.image?
        'Image'
    else
        'Binary'
    end

    res.status = 200
    res['Content-Type'] = 'application/json'
    res.body = {
        :loc => blob.loc,
        :sloc => blob.sloc,
        :type => type,
        :mime_type => blob.mime_type,
        :language => blob.language,
    }.to_json
end

if __FILE__ == $0
  server = WEBrick::HTTPServer.new :Port => 3000
  server.mount_proc '/', Handler
  trap 'INT' do server.shutdown end
  server.start
end

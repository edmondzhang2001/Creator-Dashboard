const express = require('express');
const axios = require('axios');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8001;

const GRAPH_API_VERSION = process.env.GRAPH_API_VERSION;

app.use(express.json());

app.post('/post-reel', async(req, res) => {
    console.log("posting");
    try {
        const {description, videoUrl, coverUrl} = req.body;
        const accessToken = process.env.IG_REELS_ACCESS_TOKEN;
        const igUserId = process.env.IG_USER_ID;
        
        const {id: containerId} = await uploadReelsToContainer(accessToken, igUserId, description, videoUrl, coverUrl);

        let status = null;
        const TWO_MINUTES = 2 * 60 * 1000;
        const startTime = Date.now();

        while (status !== 'FINISHED') {
            if (Date.now() - startTime > TWO_MINUTES) {
                throw new Error('Upload took longer than 2 minutes.');
            }

            status = await getStatusOfUpload(accessToken, containerId);
            await new Promise((r) => setTimeout(r, 1000));

        }
        
        const { id:creationId } = await publishMedia(accessToken, containerId, igUserId);
        const { permalink } = await fetchPermaLink(accessToken, creationId);

        res.status(200).json({creationId, permalink});
    }
    catch (error) {
        console.error('Error posting reel:', error.response ? error.response.data : error.message);
        res.status(500).json({ error: error.message });
    }
})

app.get('/test', (req, res) => {
    res.send('Test route working');
});

//used to upload to reel
const uploadReelsToContainer = async (
    accessToken,
    igUserId,
    description,
    videoUrl,
    coverUrl
) => {
    const response = await axios.post(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igUserId}/media`, {
        video_url: videoUrl,
        cover_url: coverUrl,
        caption: description,
        media_type: 'REELS',
        access_token: accessToken,
    });
    return response.data;

}

//used to get status of the upload (whether or not its done processing)
const getStatusOfUpload = async(accessToken, containerId) => {
    const response = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${containerId}?fields=status_code&access_token=${accessToken}`);
    return response.data.status_code;
}

//used to publish the reel after its been uploaded
const publishMedia = async(accessToken, containerId, igUserId) => {
    const response = await axios.post(`https://graph.facebook.com/${GRAPH_API_VERSION}/${igUserId}/media_publish`, {
        creation_id: containerId,
        access_token: accessToken,
    });
    return response.data;
}

//used to get link for display afterwards

const fetchPermaLink = async(accessToken, creationId) => {
    const response = await axios.get(`https://graph.facebook.com/${GRAPH_API_VERSION}/${creationId}?fields=permalink&access_token=${accessToken}`);
    return response.data;
};

app.listen(PORT, () => {
    console.log(`Instagram Reels Service is running on port ${PORT}`);
})
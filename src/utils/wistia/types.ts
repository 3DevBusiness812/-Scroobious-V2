const WISTIA_SUCCESS_PAYLOAD = {
  data: {
    id: 84824945,
    name: 'VqUVQ2XqOCLnT5J-_b0R9_example_video.mp4',
    type: 'Video',
    created: '2022-01-29T20:55:55+00:00',
    updated: '2022-01-29T20:55:55+00:00',
    hashed_id: 'hn3jrejwpy', // The test video on Wistia
    description: '',
    progress: 0,
    status: 'queued',
    thumbnail: {
      url: 'https://fast.wistia.com/assets/images/zebra/elements/dashed-thumbnail.png',
      width: 200,
      height: 120,
    },
    account_id: 988989,
  },
};

const WISTIA_MEDIA_STATS = {
  "load_count": 100,
  "play_count": 80,
  "play_rate": 0.54,
  "hours_watched": 21.9,
  "engagement": 0.89,
  "visitors": 94,
  "actions": [{ "type": "Call to Action", "action_count": 24, "impression_count": 84, "rate": 0.286 }]
}

const WISTIA_MEDIA_INFO = {
  "id": 104045128,
  "name": "string",
  "type": "Video",
  "archived": false,
  "created": "2023-04-27T14:11:07+00:00",
  "updated": "2023-05-04T12:57:21+00:00",
  "duration": 149.745,
  "hashed_id": "aafapwhjq7",
  "description": "",
  "progress": 1,
  "status": "ready",
  "thumbnail": {
    "url": "https://embed-ssl.wistia.com/deliveries/aaa81f2181855aeb55c763f1175a777a0dc8add6.jpg?image_crop_resized=200x120",
    "width": 200,
    "height": 120
  },
  "project": {
    "id": 6849125,
    "name": "string",
    "hashed_id": "aajl1qv3l2"
  },
  "assets": [
    {
      "url": "http://embed.wistia.com/deliveries/aa911d0478f9f64b50489bdb6a87d59f.bin",
      "width": 1280,
      "height": 720,
      "fileSize": 115995396,
      "contentType": "video/quicktime",
      "type": "OriginalFile"
    },
    {
      "url": "http://embed.wistia.com/deliveries/aaab9255aed4daf88011a0f7ffed3e9b72709f12.bin",
      "width": 640,
      "height": 360,
      "fileSize": 6072235,
      "contentType": "video/mp4",
      "type": "IphoneVideoFile"
    },
    {
      "url": "http://embed.wistia.com/deliveries/aae0761102c4cd3f2beee99d5ac56a414d162372.bin",
      "width": 400,
      "height": 224,
      "fileSize": 4325387,
      "contentType": "video/mp4",
      "type": "Mp4VideoFile"
    },
    {
      "url": "http://embed.wistia.com/deliveries/aace8a8315799a05973a8b864ec4154992dafc14.bin",
      "width": 960,
      "height": 540,
      "fileSize": 8703455,
      "contentType": "video/mp4",
      "type": "MdMp4VideoFile"
    },
    {
      "url": "http://embed.wistia.com/deliveries/aa640232ed91e1388f336e6e01aa0d97c0605eca.bin",
      "width": 1280,
      "height": 720,
      "fileSize": 11996233,
      "contentType": "video/mp4",
      "type": "HdMp4VideoFile"
    },
    {
      "url": "http://embed.wistia.com/deliveries/aaa81f2181855aeb55c763f1175a777a0dc8add6.bin",
      "width": 1280,
      "height": 720,
      "fileSize": 123185,
      "contentType": "image/jpg",
      "type": "StillImageFile"
    },
    {
      "url": "http://embed.wistia.com/deliveries/aad15c795f7a9b66b4f118db17c13f1873b51373.bin",
      "width": 2000,
      "height": 2260,
      "fileSize": 2776995,
      "contentType": "image/jpg",
      "type": "StoryboardFile"
    }
  ],
  "transcript": {
    "videoId": "uuid"
  },
  "embedCode": "string>"


}

export type TWistiaSuccessPayload = typeof WISTIA_SUCCESS_PAYLOAD.data;
export type TWistiaMediaStats = typeof WISTIA_MEDIA_STATS;
export type TWistiaMediaInfo = typeof WISTIA_MEDIA_INFO;

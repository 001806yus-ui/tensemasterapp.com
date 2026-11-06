export default function handler(req: any, res: any) {
  res.setHeader('Content-Type', 'application/json');
  res.status(200).json([
    {
      relation: ['delegate_permission/common.handle_all_urls'],
      target: {
        namespace: 'android_app',
        package_name: 'com.tensemasterapp.app',
        sha256_cert_fingerprints: ['B2:70:DF:7A:0C:A6:7A:58:A6:5E:9B:6E:5A:15:96:06:88:4C:0C:BB:7C:CB:D9:D1:A7:4E:D5:0B:8D:79:F4:09'],
      },
    },
    ]);
}

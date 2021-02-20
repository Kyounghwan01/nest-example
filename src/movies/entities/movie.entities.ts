// 서비스로 보내고 받는 인터페이스 export 만듬
// 실제는 db 모델 들어감 (스키마)

export class Movie {
  id: number;
  title: string;
  year: number;
  genres: string[];
}

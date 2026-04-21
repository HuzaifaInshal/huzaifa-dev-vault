# Task

You will be provided with api urls along with their possible query params, params, body, response and pages on which they need to be integrated.
You can see project structure from ./agent_docs/project_structure.md. If response is not given then add some response a/c to your own. Also use Yup for validations and useFormik for form handling. Yup validations should be extensive and include all negative cases like min, max, trim etc. Also while submitting values in payload dont forget to trim them and transform email to lowercase. Form field errors should be passed to each input/select/any other fields, and mutation errors should be handled with handleMutationError in /src/utils/handleMutationError.ts
You need to convert those to something like the following style inside services folder:

```ts
interface Req {
  idA: number;
  idB: number;
  searchParamA: number;
  searchParamB: string[];
  searchParamC: string[];
  payload: {
    name: string;
    description: string;
  }; // only for PUT, POST and PATCH apis
}

interface Res {}

//  In case of get apis
export const useGetSampleData = ({}: Req) =>
  useQuery({
    queryKey: queryKeys, // will be declared in seperate file ../query-keys/
    queryFn: async () => {
      const res = await axiosInstance.get(``); // axiosInstance is declared in /src/services/axios.ts
      return res.data as Res;
    }
  });

//  In case of upsert related apis
export const useMethodSampleData = () =>
  useMutation({
    mutationFn: async ({}: Req) => {
      const res = await axiosInstance.put(``, payload); // axiosInstance is declared in /src/services/axios.ts
      return res.data as Res;
    }
  });
```

Usages:

```ts
// For query
const {data, isPending, error} = useGetSampleData();

if(isPending){
  return <loading></loading> // lucide react spinning animation; handle accordingly
}

if(error){
  return <div>{error}</div> // handle accordingly
}

// For mutation
const {mutate, isPending} = useMethodSampleData();

const randomFunction = () => {
  mutate({}, {
    onSuccess: () => {
      toast.success()
      // add more here
    },
    onError: handleMutationError
  })
}
```

// In case of infinite api

```ts
interface Req extends PaginationReq {
  idA: string;
  idB: string | null;
  searchParamA: string;
}

interface Res extends PaginationRes {
  data: relevantType[];
}

export function useGetAllInfiniteData({}: Req) {
  return useInfiniteQuery({
    queryFn: async ({ pageParam }) => {
      const res = await axiosInstance.get(``);
      return res.data as Res;
    },
    queryKey: ,
    getNextPageParam: getNextPageParam,
    initialPageParam: 1,
  });
}

//  getNextPageParam is declared in /src/utils/infiniteQueryUtils.ts
//  PaginationReq and PaginationRes are declared in /src/types/common.ts
//  also when calling the data in any api you can use transformInfiniteData from /src/utils/infiniteQueryUtils.ts
```

and then call the mutations/queries in relevant files and map the results. Remember one service in one file however keys all can be declared at one place/file. Also the basic interface of Req and Res should be placed in the same service file however you need to placed transformed responses to proper types that will be placed in ../types/<> and mapped to Res interfaces.
for e.g.

```ts
interface Res {
  user: User;
  message: string;
}

// then in /features/users/userTypes.ts

export interface User {
  name: string;
}
```

# Relevant APIs that needs to be integrated will be attached on later prompts
